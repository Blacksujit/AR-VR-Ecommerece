const mongoose = require('mongoose');

const specificationSchema = mongoose.Schema(
  {
    key: { type: String },
    value: { type: String },
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      default: 0,
    },
    images: [String],
    modelUrl: {
      type: String,
    },
    specifications: [specificationSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isARSupported: {
      type: Boolean,
      default: false,
    },
    isVRSupported: {
      type: Boolean,
      default: false,
    },
    aiScore: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    flashSale: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);
