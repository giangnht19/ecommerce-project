const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Product model
const Product = require('./models/Product');

const updateImageUrls = async () => {
  try {
    console.log('Starting image URL migration...');
    
    // Find all products with localhost URLs
    const products = await Product.find({
      image: { $regex: /localhost/i }
    });
    
    for (const product of products) {
      const oldUrl = product.image;
      // Replace localhost URL with production server URL
      const newUrl = oldUrl.replace(/http:\/\/localhost:\d+/, process.env.PRODUCTION_SERVER_URL || 'https://ecommerce-project-9xmw.onrender.com');
      
      await Product.findByIdAndUpdate(product._id, { image: newUrl });
      console.log(`Updated product ${product.id}: ${oldUrl} -> ${newUrl}`);
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

updateImageUrls();
