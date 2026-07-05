const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createCheckoutSession,
  getSessionStatus,
} = require('../controllers/stripeController');

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/session-status/:sessionId', protect, getSessionStatus);

module.exports = router;
