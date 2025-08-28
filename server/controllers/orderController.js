const Order = require('../models/Order');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const newOrder = new Order({
      userId: req.user.id,
      items: items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: req.body.cartData });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in the order.' });
    }
    const lineItems = items.map((item) => {
      if (!item.price || isNaN(item.price)) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: item.name, images: item.image ? [item.image] : [] },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?success=false&orderId=${newOrder._id}`,
    });
    await newOrder.save();
    res.json({ id: session.id, success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.verifyOrder = async (req, res) => {
  const { success, orderId } = req.body;
  try {
    if (success === 'true') {
      await Order.findOneAndUpdate({ _id: orderId }, { payment: true });
      
      // Clear the user's cart after successful payment
      let cart = {};
      for (let i = 0; i < 300; i++) cart[i] = 0;
      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: cart });
      
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      await Order.findOneAndDelete(orderId);
      res.json({ success: false, message: 'Payment Failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find({ userId: req.user.id });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
