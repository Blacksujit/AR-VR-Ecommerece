const express = require('express');
const {
  createOrder,
  getOrderQuote,
  getUserOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/quote', protect, getOrderQuote);
router.route('/').post(protect, createOrder).get(protect, getOrders);
router.get('/myorders', protect, getUserOrders);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
