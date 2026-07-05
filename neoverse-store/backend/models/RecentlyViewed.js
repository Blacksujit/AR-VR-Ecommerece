const mongoose = require('mongoose');

const recentlyViewedSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

recentlyViewedSchema.index({ user: 1, viewedAt: -1 });
recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
