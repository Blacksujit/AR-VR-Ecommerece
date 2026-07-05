const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
