const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  wishlist: user.wishlist,
  addresses: user.addresses,
  createdAt: user.createdAt,
});

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json({
      success: true,
      data: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const { name, avatar } = req.body;
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    const updated = await user.save();
    res.json({
      success: true,
      data: formatUserResponse(updated),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentUser, updateProfile };
