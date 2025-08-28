require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Image model (same as in your main server)
const ImageSchema = new mongoose.Schema({
    filename: String,
    data: String, // Base64 encoded image
    contentType: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', ImageSchema);

async function testImageStorage() {
    try {
        console.log('🔍 Testing database image storage...');
        
        // Count existing images
        const imageCount = await Image.countDocuments();
        console.log(`📊 Current images in database: ${imageCount}`);
        
        // Get recent images
        const recentImages = await Image.find()
            .select('-data') // Don't load the actual image data
            .sort({ uploadDate: -1 })
            .limit(5);
            
        console.log('\n📸 Recent images:');
        recentImages.forEach((img, index) => {
            console.log(`${index + 1}. ${img.filename}`);
            console.log(`   - ID: ${img._id}`);
            console.log(`   - Type: ${img.contentType}`);
            console.log(`   - Size: ${(img.size / 1024).toFixed(2)} KB`);
            console.log(`   - Uploaded: ${img.uploadDate}`);
            console.log(`   - URL: /images/${img._id}\n`);
        });
        
        if (imageCount === 0) {
            console.log('ℹ️  No images found. Upload some images using POST /upload to test.');
        } else {
            console.log('✅ Database image storage is working correctly!');
        }
        
    } catch (error) {
        console.error('❌ Error testing image storage:', error);
    } finally {
        mongoose.connection.close();
    }
}

testImageStorage();
