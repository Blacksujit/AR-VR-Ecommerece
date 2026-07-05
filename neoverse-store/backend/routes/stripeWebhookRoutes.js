const express = require('express');
const { handleWebhook } = require('../controllers/stripeController');

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
