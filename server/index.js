
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

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
    },
});

const upload = multer({ 
    storage: storage,
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

// Creating Upload Endpoints
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: 'No file uploaded'
            });
        }

        // Use environment variable or determine the correct base URL
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? (process.env.SERVER_URL || `https://${req.get('host')}`)
            : `http://localhost:${port}`;
        
        const imageUrl = `${baseUrl}/images/${req.file.filename}`;
        
        console.log(`Image uploaded: ${imageUrl}`);
        
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