const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return next(new AppError('Product ID is required', 400));

    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return next(new AppError('Product ID is required', 400));
    if (!quantity || quantity < 1) return next(new AppError('Quantity must be at least 1', 400));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError('Cart not found', 404));

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) return next(new AppError('Item not found in cart', 404));

    item.quantity = quantity;
    await cart.save();

    const updated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) return next(new AppError('Product ID is required', 400));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError('Cart not found', 404));

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const updated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    next(error);
  }
};

const mergeCart = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return next(new AppError('Items array is required', 400));

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const incoming of items) {
      const product = await Product.findById(incoming.productId);
      if (!product) continue;
      const existing = cart.items.find((item) => item.product.toString() === incoming.productId);
      if (existing) {
        existing.quantity = Math.max(existing.quantity, incoming.quantity || 1);
      } else {
        cart.items.push({ product: incoming.productId, quantity: incoming.quantity || 1 });
      }
    }

    await cart.save();
    const updated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
};
