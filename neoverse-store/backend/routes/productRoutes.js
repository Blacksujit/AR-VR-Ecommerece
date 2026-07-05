const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTopRatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/top', getTopRatedProducts);
router.route('/:slug').get(getProductBySlug);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
