const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const QUOTE_TTL_MS = 10 * 60 * 1000;
const SHIPPING_THRESHOLD = 100;
const SHIPPING_PRICE = 9.99;
const TAX_RATE = 0.08;

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('No order items', 400);
  }

  const requestedItems = new Map();
  for (const item of items) {
    const productId = String(item.product || '');
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new AppError('Each order item requires a valid product and quantity', 400);
    }
    requestedItems.set(productId, (requestedItems.get(productId) || 0) + quantity);
  }
  return requestedItems;
};

const calculateQuote = (products, requestedItems) => {
  const productById = new Map(products.map((product) => [product._id.toString(), product]));
  const items = [];
  let subtotal = 0;

  for (const [productId, quantity] of requestedItems) {
    const product = productById.get(productId);
    if (!product) throw new AppError(`Product not found: ${productId}`, 404);
    if (product.stock < quantity) throw new AppError(`Insufficient stock for ${product.name}`, 409);

    const unitPrice = Number((product.price - (product.price * product.discount) / 100).toFixed(2));
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    subtotal += lineTotal;
    items.push({
      productId: product._id,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return {
    items,
    currency: 'usd',
    subtotal,
    shipping,
    tax,
    taxRate: TAX_RATE,
    total,
    expiresAt: new Date(Date.now() + QUOTE_TTL_MS).toISOString(),
  };
};

const getOrderQuote = async (req, res, next) => {
  try {
    const requestedItems = normalizeItems(req.body.items);
    const products = await Product.find({ _id: { $in: [...requestedItems.keys()] } });
    const quote = calculateQuote(products, requestedItems);
    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const session = await Product.startSession();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('No order items', 400));
    }
    if (!shippingAddress || !paymentMethod) {
      return next(new AppError('Shipping address and payment method are required', 400));
    }

    const requestedItems = normalizeItems(items);

    const productIds = [...requestedItems.keys()];
    const products = await Product.find({ _id: { $in: productIds } }).session(session);
    const productById = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems = [];
    let itemsPrice = 0;
    for (const [productId, quantity] of requestedItems) {
      const product = productById.get(productId);
      if (!product) return next(new AppError(`Product not found: ${productId}`, 404));
      if (product.stock < quantity) {
        return next(new AppError(`Insufficient stock for ${product.name}`, 400));
      }

      const price = Number((product.price - (product.price * product.discount) / 100).toFixed(2));
      itemsPrice += price * quantity;
      orderItems.push({ product: product._id, quantity, price });
    }

    const shippingPrice = itemsPrice >= 100 ? 0 : 10;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    let order;
    await session.withTransaction(async () => {
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
        if (!updated) throw new AppError('Inventory changed. Please review your cart and try again.', 409);
      }

      [order] = await Order.create([{
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }], { session });
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to view this order', 403));
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'confirmed';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderQuote,
  getUserOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};
