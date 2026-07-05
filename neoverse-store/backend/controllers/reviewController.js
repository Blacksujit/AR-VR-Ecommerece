const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { AppError } = require('../middleware/errorHandler');

const getProductReviews = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) throw new AppError('Product not found', 404);

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rating, title, comment } = req.body;
    const product = await Product.findOne({ slug });
    if (!product) throw new AppError('Product not found', 404);

    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });
    if (alreadyReviewed) {
      throw new AppError('You have already reviewed this product', 400);
    }

    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': product._id,
      isDelivered: true,
    });

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating: Number(rating),
      title,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    product.rating = Math.round((stats[0]?.avgRating || 0) * 10) / 10;
    product.numReviews = stats[0]?.count || 0;
    await product.save();

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new AppError('Review not found', 404);

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this review', 403);
    }

    await Review.findByIdAndDelete(req.params.id);

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      rating: stats[0] ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      numReviews: stats[0]?.count || 0,
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
