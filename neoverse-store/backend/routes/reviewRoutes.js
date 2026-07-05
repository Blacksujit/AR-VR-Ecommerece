const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');

router.get('/:slug/reviews', getProductReviews);
router.post('/:slug/reviews', protect, createReview);
router.delete('/:slug/reviews/:id', protect, deleteReview);

module.exports = router;
