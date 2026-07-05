const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');
const { getRecommendations, trackEvent } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/', optionalAuth, getRecommendations);
router.post('/track', optionalAuth, trackEvent);

module.exports = router;
