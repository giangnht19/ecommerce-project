const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addproduct', productController.addProduct);
router.post('/deleteproduct', productController.deleteProduct);
router.get('/allproducts', productController.getAllProducts);
router.get('/newcollection', productController.getNewCollection);
router.get('/popularmen', productController.getPopularMen);

module.exports = router;
