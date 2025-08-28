const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const fetchUser = require('../utils/fetchUser');

router.post('/place-order', fetchUser, orderController.placeOrder);
router.post('/verify-order', fetchUser, orderController.verifyOrder);
router.post('/getorders', fetchUser, orderController.getOrders);
router.get('/allorders', orderController.getAllOrders);
router.put('/orders/:id', orderController.updateOrderStatus);

module.exports = router;
