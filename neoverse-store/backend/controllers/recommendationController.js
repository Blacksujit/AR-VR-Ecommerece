const Product = require('../models/Product');
const Order = require('../models/Order');

const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const viewedProductId = req.query.productId;
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    const signals = {
      categories: new Set(),
      viewedIds: new Set(),
      purchasedIds: new Set(),
      priceRange: { min: Infinity, max: 0 },
      topTags: new Map(),
      topBrands: new Map(),
    };

    if (viewedProductId) {
      const viewed = await Product.findById(viewedProductId).lean();
      if (viewed) {
        signals.categories.add(viewed.category);
        signals.priceRange.min = viewed.price * 0.5;
        signals.priceRange.max = viewed.price * 2;
        viewed.tags?.forEach(t => signals.topTags.set(t, (signals.topTags.get(t) || 0) + 1));
        signals.topBrands.set(viewed.brand, 1);
      }
    }

    if (userId) {
      const orders = await Order.find({ user: userId })
        .populate('items.product', 'category tags brand price')
        .lean();

      for (const order of orders) {
        for (const item of order.items) {
          if (item.product) {
            signals.purchasedIds.add(item.product._id.toString());
            signals.categories.add(item.product.category);
            item.product.tags?.forEach(t =>
              signals.topTags.set(t, (signals.topTags.get(t) || 0) + 1)
            );
            signals.topBrands.set(
              item.product.brand,
              (signals.topBrands.get(item.product.brand) || 0) + 1
            );
            if (item.product.price < signals.priceRange.min) signals.priceRange.min = item.product.price * 0.7;
            if (item.product.price > signals.priceRange.max) signals.priceRange.max = item.product.price * 1.3;
          }
        }
      }

      const wishlistUser = await require('../models/User').findById(userId).lean();
      if (wishlistUser?.wishlist) {
        const wishlistProducts = await Product.find({
          _id: { $in: wishlistUser.wishlist },
        }).lean();
        for (const p of wishlistProducts) {
          signals.categories.add(p.category);
          signals.topBrands.set(p.brand, (signals.topBrands.get(p.brand) || 0) + 1);
        }
      }
    }

    if (signals.categories.size === 0) {
      const trending = await Product.find({ trending: true })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit)
        .lean();
      return res.json({ success: true, data: trending });
    }

    const topCategories = [...signals.categories].slice(0, 3);
    const topBrand = [...signals.topBrands.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const topTags = [...signals.topTags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    const scorePipeline = [
      {
        $match: {
          _id: { $nin: [...signals.purchasedIds, ...(viewedProductId ? [viewedProductId] : [])].filter(Boolean) },
          stock: { $gt: 0 },
        },
      },
      { $addFields: { score: 0 } },
    ];

    let query = Product.find({
      _id: { $nin: [...signals.purchasedIds, ...(viewedProductId ? [viewedProductId] : [])].filter(Boolean) },
      stock: { $gt: 0 },
    });

    const orConditions = [];

    if (topCategories.length > 0) {
      orConditions.push({ category: { $in: topCategories } });
    }
    if (topBrand) {
      orConditions.push({ brand: topBrand });
    }
    if (topTags.length > 0) {
      orConditions.push({ tags: { $in: topTags } });
    }

    if (signals.priceRange.min < Infinity && signals.priceRange.max > 0) {
      orConditions.push({
        price: { $gte: signals.priceRange.min, $lte: signals.priceRange.max },
      });
    }

    if (orConditions.length > 0) {
      query = query.or(orConditions);
    }

    const sortFields = [];
    if (signals.purchasedIds.size > 0) {
      sortFields.push({ rating: -1 });
      sortFields.push({ numReviews: -1 });
    } else if (viewedProductId) {
      sortFields.push({ rating: -1 });
      sortFields.push({ trending: -1 });
    } else {
      sortFields.push({ trending: -1 });
      sortFields.push({ rating: -1 });
    }

    sortFields.push({ createdAt: -1 });
    const sortObj = sortFields.reduce((acc, s) => ({ ...acc, ...s }), {});

    const recommendations = await query
      .sort(sortObj)
      .limit(limit)
      .lean();

    if (recommendations.length < limit && signals.categories.size === 0) {
      const fallback = await Product.find({
        _id: { $nin: [...signals.purchasedIds, ...(viewedProductId ? [viewedProductId] : [])].filter(Boolean) },
        stock: { $gt: 0 },
      })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit - recommendations.length)
        .lean();
      recommendations.push(...fallback);
    }

    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

const trackEvent = async (req, res, next) => {
  try {
    const { type, productId, metadata } = req.body;
    const userId = req.user?._id;

    if (!type || !productId) {
      return res.status(400).json({ success: false, message: 'Type and productId required' });
    }

    const Event = require('../models/RecommendationEvent');
    await Event.create({
      user: userId,
      product: productId,
      type,
      metadata: metadata || {},
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, trackEvent };
