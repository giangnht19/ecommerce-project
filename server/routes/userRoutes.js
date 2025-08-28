const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fetchUser = require('../utils/fetchUser');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/addtocart', fetchUser, userController.addToCart);
router.post('/removefromcart', fetchUser, userController.removeFromCart);
router.post('/getcartdata', fetchUser, userController.getCartData);
router.post('/clearcart', fetchUser, userController.clearCart);

module.exports = router;
