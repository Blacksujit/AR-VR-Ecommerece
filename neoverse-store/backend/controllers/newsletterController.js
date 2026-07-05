const Newsletter = require('../models/Newsletter');
const { AppError } = require('../middleware/errorHandler');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) throw new AppError('Email is required', 400);

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.json({ success: true, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const entry = await Newsletter.findOne({ email: email?.toLowerCase() });
    if (!entry) throw new AppError('Email not found in our list', 404);
    entry.isActive = false;
    await entry.save();
    res.json({ success: true, message: 'Successfully unsubscribed.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, unsubscribe };
