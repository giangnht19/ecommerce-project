const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Product model
const Product = require('./models/Product');

const checkProducts = async () => {
  try {
    console.log('Checking products in database...');
    
    const products = await Product.find({}).limit(5);
    console.log(`Total products: ${await Product.countDocuments()}`);
    
    console.log('\nFirst 5 products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}, Name: ${product.name.substring(0, 30)}...`);
      console.log(`   Image URL: ${product.image}`);
      console.log('');
    });
    
    // Check for localhost URLs
    const localhostProducts = await Product.find({
      image: { $regex: /localhost/i }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking products:', error);
    process.exit(1);
  }
};

checkProducts();
