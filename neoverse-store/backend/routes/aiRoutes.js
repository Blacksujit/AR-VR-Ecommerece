const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { chat, search } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', optionalAuth, chat);
router.get('/search', search);

module.exports = router;
