const mongoose = require('mongoose');

const recommendationEventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['view', 'wishlist', 'add_to_cart', 'purchase', 'share', 'ar_view', 'vr_view'],
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

recommendationEventSchema.index({ user: 1, type: 1 });
recommendationEventSchema.index({ product: 1 });
recommendationEventSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('RecommendationEvent', recommendationEventSchema);
