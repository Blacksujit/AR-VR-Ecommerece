const express = require('express');
const { Webhook } = require('svix');
const { webhookHandler } = require('../webhooks/clerk');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      // For development, allow bypass when no webhook secret is configured
      if (!process.env.CLERK_WEBHOOK_SECRET) {
        req.body = JSON.parse(req.body.toString());
        return webhookHandler(req, res);
      }
      return next(new AppError('Missing svix headers', 400));
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(req.body.toString(), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    req.body = payload;
    await webhookHandler(req, res);
  } catch (error) {
    return next(new AppError('Invalid webhook signature', 400));
  }
});

module.exports = router;
