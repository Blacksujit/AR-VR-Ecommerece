const express = require('express');
const { getCurrentUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
