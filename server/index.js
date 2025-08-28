
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

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoints
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    // Use environment variable or determine the correct base URL
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? `https://${req.get('host')}` 
        : `http://localhost:${port}`;
    
    res.json({
        success: 1,
        image_url: `${baseUrl}/images/${req.file.filename}`,
    });
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