const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      arCompatible,
      vrCompatible,
      sort,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (arCompatible === 'true') {
      query.isARSupported = true;
    }

    if (vrCompatible === 'true') {
      query.isVRSupported = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'name':
          sortOption = { name: 1 };
          break;
        case 'popular':
          sortOption = { numReviews: -1, rating: -1 };
          break;
        case 'discount':
          sortOption = { discount: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);
    const pageNum = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
    const limitNum = Number.isFinite(parsedLimit) ? Math.min(50, Math.max(1, parsedLimit)) : 12;
    const skip = (pageNum - 1) * limitNum;

    // Add a stable tie-breaker so items do not move between pages when
    // multiple products share the same primary sort value.
    const stableSort = { ...sortOption, _id: 1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('-__v')
        .sort(stableSort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
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

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .sort({ rating: -1 })
      .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getTopRatedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ rating: { $gte: 4 } })
      .sort({ rating: -1 })
      .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTopRatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
