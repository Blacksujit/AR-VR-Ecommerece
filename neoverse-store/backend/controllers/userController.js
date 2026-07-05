const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const RecentlyViewed = require('../models/RecentlyViewed');
const Notification = require('../models/Notification');
const SearchHistory = require('../models/SearchHistory');
const Order = require('../models/Order');
const { AppError } = require('../middleware/errorHandler');

const formatUser = (user) => ({
  _id: user._id,
  clerkId: user.clerkId,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  phone: user.phone,
  role: user.role,
  wishlist: user.wishlist,
  addresses: user.addresses,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) return next(new AppError('User not found', 404));

    const preferences = await UserPreferences.findOne({ user: user._id });

    res.json({
      success: true,
      data: { ...formatUser(user), preferences: preferences || {} },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found', 404));

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    const updated = await user.save();
    res.json({ success: true, data: formatUser(updated) });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await UserPreferences.deleteOne({ user: req.user._id });
    await RecentlyViewed.deleteMany({ user: req.user._id });
    await Notification.deleteMany({ user: req.user._id });
    await SearchHistory.deleteMany({ user: req.user._id });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, street, city, state, zip, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({ fullName, phone, street, city, state, zip, country, isDefault: isDefault || false });
    await user.save();

    res.status(201).json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, street, city, state, zip, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) return next(new AppError('Address not found', 404));

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.assign(address, { fullName, phone, street, city, state, zip, country, isDefault });
    await user.save();

    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);
    await user.save();

    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const getPreferences = async (req, res, next) => {
  try {
    let prefs = await UserPreferences.findOne({ user: req.user._id });
    if (!prefs) {
      prefs = await UserPreferences.create({ user: req.user._id });
    }
    res.json({ success: true, data: prefs });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const prefs = await UserPreferences.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: prefs });
  } catch (error) {
    next(error);
  }
};

const getRecentlyViewed = async (req, res, next) => {
  try {
    const items = await RecentlyViewed.find({ user: req.user._id })
      .sort({ viewedAt: -1 })
      .limit(20)
      .populate('product');
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const addRecentlyViewed = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await RecentlyViewed.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { viewedAt: new Date() },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user._id },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

const deleteSearchHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
