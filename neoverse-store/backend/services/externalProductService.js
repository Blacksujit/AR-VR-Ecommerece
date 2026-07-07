const https = require('https');
const Product = require('../models/Product');
const Category = require('../models/Category');

const API_BASE = 'https://dummyjson.com';

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(new Error(`Failed to parse: ${data.slice(0, 200)}`)); }
    });
  }).on('error', reject);
});

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const syncProductsAndCategories = async () => {
  console.log('Fetching products from DummyJSON...');
  const productRes = await fetchJson(`${API_BASE}/products?limit=200`);

  console.log('Fetching categories from DummyJSON...');
  const categoriesData = await fetchJson(`${API_BASE}/products/categories`);

  const now = new Date();

  const categories = categoriesData.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    description: `Products in the ${cat.name} category`,
    image: '',
  }));

  const catMap = {};
  categories.forEach((c) => { catMap[c.slug] = c.name; });

  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log(`Synced ${categories.length} categories`);

  const products = productRes.products.map((p) => {
    const numReviews = p.reviews ? p.reviews.length : Math.floor(Math.random() * 500) + 5;
    return {
      name: p.title,
      slug: slugify(p.title) + '-' + p.id,
      description: p.description,
      brand: p.brand || 'Generic',
      category: catMap[p.category] || p.category,
      price: p.price,
      discount: Math.round(p.discountPercentage || 0),
      stock: p.stock || 0,
      images: [p.thumbnail, ...(p.images || [])],
      specifications: [
        { key: 'Weight', value: p.weight ? `${p.weight}g` : 'N/A' },
        { key: 'SKU', value: p.sku || 'N/A' },
        { key: 'Warranty', value: p.warrantyInformation || 'N/A' },
        { key: 'Shipping', value: p.shippingInformation || 'N/A' },
      ],
      rating: p.rating || 0,
      numReviews,
      isARSupported: false,
      isVRSupported: false,
      aiScore: +((p.rating || 0) * 2).toFixed(1),
      featured: (p.rating || 0) >= 4.5,
      trending: (p.rating || 0) >= 4.0 && (p.stock || 0) > 30,
      newArrival: (p.stock || 0) > 80,
      flashSale: (p.discountPercentage || 0) > 20,
      tags: p.tags || [],
      createdAt: now,
      updatedAt: now,
    };
  });

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Synced ${products.length} products`);

  return { categories: categories.length, products: products.length };
};

module.exports = { syncProductsAndCategories };
