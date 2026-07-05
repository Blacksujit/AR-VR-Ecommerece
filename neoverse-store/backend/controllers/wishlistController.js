const User = require('../models/User');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) throw new AppError('Product ID is required', 400);

    const product = await Product.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(productId)) {
      return res.json({ success: true, message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    const populated = await User.findById(user._id).populate('wishlist');
    res.status(201).json({ success: true, data: populated.wishlist });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    const populated = await User.findById(user._id).populate('wishlist');
    res.json({ success: true, data: populated.wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
