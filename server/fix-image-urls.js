const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Product model
const Product = require('./models/Product');

const fixImageUrls = async () => {
  try {
    console.log('Fixing product image URLs...');
    
    // Find products with localhost URLs
    const localhostProducts = await Product.find({
      image: { $regex: /localhost/i }
    });
    
    console.log(`Found ${localhostProducts.length} products with localhost URLs`);
    
    if (localhostProducts.length > 0) {
      for (const product of localhostProducts) {
        const oldUrl = product.image;
        // Replace localhost with the production server URL
        const newUrl = oldUrl.replace(/http:\/\/localhost:\d+/i, process.env.SERVER_URL || 'https://ecommerce-project-9xmw.onrender.com');
        
        await Product.findByIdAndUpdate(product._id, { image: newUrl });
        console.log(`Updated product ${product.id}: ${product.name}`);
        console.log(`  Old URL: ${oldUrl}`);
        console.log(`  New URL: ${newUrl}`);
        console.log('');
      }
      console.log(`Successfully updated ${localhostProducts.length} product(s)`);
    } else {
      console.log('No products with localhost URLs found');
    }
    
    // Check for products with missing or broken image URLs
    const productsWithoutImages = await Product.find({
      $or: [
        { image: { $exists: false } },
        { image: "" },
        { image: null }
      ]
    });
    
    console.log(`\nFound ${productsWithoutImages.length} products without images`);
    if (productsWithoutImages.length > 0) {
      productsWithoutImages.forEach(product => {
        console.log(`Product ${product.id}: ${product.name} - Missing image`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    process.exit(1);
  }
};

fixImageUrls();
