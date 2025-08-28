
require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Import models to ensure MongoDB collections are created
require('./models/Product');
require('./models/User');
require('./models/Order');

// Routers
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.use(express.urlencoded({ extended: true }));

// API Creation
app.get('/', (req, res) => {
    res.send('Express App is up and running');
});

// Store images in memory for processing
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Image model for storing in database
const ImageSchema = new mongoose.Schema({
    filename: String,
    data: String, // Base64 encoded image
    contentType: String,
    size: Number, // File size in bytes
    uploadDate: { type: Date, default: Date.now }
});

// Add index for better performance
ImageSchema.index({ uploadDate: 1 });

const Image = mongoose.model('Image', ImageSchema);

// Serve images from database
app.get('/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({
                success: 0,
                message: 'Image not found'
            });
        }
        
        const buffer = Buffer.from(image.data, 'base64');
        
        // Set appropriate headers
        res.set({
            'Content-Type': image.contentType,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            'ETag': image._id.toString()
        });
        
        res.send(buffer);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({
            success: 0,
            message: 'Error retrieving image'
        });
    }
});

// Creating Upload Endpoints
app.post('/upload', upload.single('product'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: 'No file uploaded'
            });
        }

        // Convert image to base64 and save to database
        const base64Data = req.file.buffer.toString('base64');
        
        const newImage = new Image({
            filename: `${req.file.fieldname}_${Date.now()}_${req.file.originalname}`,
            data: base64Data,
            contentType: req.file.mimetype,
            size: req.file.size
        });

        const savedImage = await newImage.save();
        
        // Use environment variable or determine the correct base URL
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? (process.env.SERVER_URL || `https://${req.get('host')}`)
            : `http://localhost:${port}`;
        
        const imageUrl = `${baseUrl}/images/${savedImage._id}`;
        
        console.log(`Image uploaded to database: ${imageUrl}`);
        
        res.json({
            success: 1,
            image_url: imageUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: 0,
            message: 'Upload failed'
        });
    }
});

// Additional image management endpoints

// Get image info without downloading the image
app.get('/images/:id/info', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).select('-data');
        if (!image) {
            return res.status(404).json({
                success: 0,
                message: 'Image not found'
            });
        }
        
        res.json({
            success: 1,
            image: {
                id: image._id,
                filename: image.filename,
                contentType: image.contentType,
                size: image.size,
                uploadDate: image.uploadDate
            }
        });
    } catch (error) {
        console.error('Error retrieving image info:', error);
        res.status(500).json({
            success: 0,
            message: 'Error retrieving image info'
        });
    }
});

// Delete an image
app.delete('/images/:id', async (req, res) => {
    try {
        const deletedImage = await Image.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).json({
                success: 0,
                message: 'Image not found'
            });
        }
        
        res.json({
            success: 1,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: 0,
            message: 'Error deleting image'
        });
    }
});

// List all images (with pagination)
app.get('/images', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const images = await Image.find()
            .select('-data') // Don't include the actual image data
            .sort({ uploadDate: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Image.countDocuments();
        
        res.json({
            success: 1,
            images: images.map(img => ({
                id: img._id,
                filename: img.filename,
                contentType: img.contentType,
                size: img.size,
                uploadDate: img.uploadDate,
                url: `${req.protocol}://${req.get('host')}/images/${img._id}`
            })),
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                count: images.length,
                totalImages: total
            }
        });
    } catch (error) {
        console.error('Error listing images:', error);
        res.status(500).json({
            success: 0,
            message: 'Error listing images'
        });
    }
});

// Use Routers
app.use('/', productRoutes);
app.use('/', userRoutes);
app.use('/', orderRoutes);



app.listen(port, (error) => {
    if (!error) {
        console.log('Server is Successfully running, listening on port ' + port);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});