const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      maxlength: 5000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
