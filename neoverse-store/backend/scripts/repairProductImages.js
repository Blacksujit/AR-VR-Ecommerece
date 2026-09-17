const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const isUsableImageUrl = (value) =>
  typeof value === 'string' && /^https:\/\//i.test(value.trim());

async function repairProductImages() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const products = await Product.find({}, { name: 1, images: 1 });
  let changed = 0;
  let removed = 0;

  for (const product of products) {
    const images = Array.from(new Set(
      (Array.isArray(product.images) ? product.images : [])
        .map((value) => typeof value === 'string' ? value.trim() : '')
        .filter(isUsableImageUrl)
    ));

    const previousImages = Array.isArray(product.images) ? product.images : [];
    const previous = JSON.stringify(previousImages);
    if (previous !== JSON.stringify(images)) {
      removed += Math.max(0, previousImages.length - images.length);
      product.images = images;
      await product.save();
      changed += 1;
      console.log(`${product.name}: retained ${images.length} HTTPS image(s)`);
    }
  }

  console.log(`Repaired ${changed} product record(s).`);
  console.log(`Removed ${removed} unsupported or invalid image value(s).`);
}

repairProductImages()
  .catch((error) => {
    console.error('Product image repair failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
