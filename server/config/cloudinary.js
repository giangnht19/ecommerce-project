const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce-products',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' }
        ],
        public_id: (req, file) => {
            return `product_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        },
    },
});

// Configure multer with cloudinary storage
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

module.exports = { cloudinary, upload };
