const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });
  await user.save();
  const data = { user: { id: user.id } };
  const authToken = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, message: 'User registered successfully', token: authToken });
};

exports.login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    if (req.body.password === user.password) {
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, message: 'User logged in successfully', token: authToken });
    } else {
      res.json({ success: false, message: 'Wrong Password' });
    }
  } else {
    res.json({ success: false, message: 'Wrong Email' });
  }
};

exports.addToCart = async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.json({ success: true });
};

exports.removeFromCart = async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.json({ success: true });
};

exports.getCartData = async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
};
