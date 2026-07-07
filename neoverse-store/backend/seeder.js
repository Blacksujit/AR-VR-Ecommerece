const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { syncProductsAndCategories } = require('./services/externalProductService');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Fetching real products from DummyJSON...');
    const result = await syncProductsAndCategories();

    console.log(`Seeded ${result.products} products from DummyJSON`);
    console.log(`Seeded ${result.categories} categories from DummyJSON`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
