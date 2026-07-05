const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
  family: {
    type: String,
    required: true,
    index: true,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
