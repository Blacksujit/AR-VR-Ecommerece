const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { submitContact, getMessages, markRead } = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', protect, admin, getMessages);
router.patch('/:id/read', protect, admin, markRead);

module.exports = router;
