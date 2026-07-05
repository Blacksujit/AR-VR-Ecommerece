const express = require('express');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../controllers/resendController');

const router = express.Router();

router.post('/send', protect, sendEmail);

module.exports = router;
