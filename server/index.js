
require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Import cloudinary configuration
const { cloudinary, upload } = require('./config/cloudinary');

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

// Environment check endpoint for debugging
app.get('/env-check', (req, res) => {
    const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        SERVER_URL: process.env.SERVER_URL,
        CLIENT_URL: process.env.CLIENT_URL,
        host: req.get('host'),
        protocol: req.protocol
    };
    
    console.log('Environment check requested:', envVars);
    res.json(envVars);
});

// Creating Upload Endpoints - Using Cloudinary for persistent storage
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: 'No file uploaded'
            });
        }

        // Cloudinary automatically provides the secure_url
        const imageUrl = req.file.path;
        
        console.log(`Image uploaded to Cloudinary: ${imageUrl}`);
        
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