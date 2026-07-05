const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name').lean();
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.name });
        return { ...cat, productCount: count };
      })
    );
    res.json({ success: true, data: withCounts });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
