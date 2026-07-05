const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getPreferences,
  updatePreferences,
  getRecentlyViewed,
  addRecentlyViewed,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getSearchHistory,
  deleteSearchHistory,
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.get('/preferences', protect, getPreferences);
router.patch('/preferences', protect, updatePreferences);

router.get('/recently-viewed', protect, getRecentlyViewed);
router.post('/recently-viewed', protect, addRecentlyViewed);

router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:notificationId/read', protect, markNotificationRead);
router.post('/notifications/read-all', protect, markAllNotificationsRead);

router.get('/search-history', protect, getSearchHistory);
router.delete('/search-history', protect, deleteSearchHistory);

module.exports = router;
