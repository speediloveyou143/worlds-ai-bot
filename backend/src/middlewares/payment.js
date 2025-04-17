const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const paymentAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).json('Please login, token expired');

    const { id } = jwt.verify(token, "dream");
    const user = await User.findById(id);

    if (!user) return res.status(404).json("User not found");

    // Check if user has paid (courses array length > 1)
    if (!user.courses || user.courses.length <= 1) {
      return res.status(403).json("Access denied. Payment required.");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { paymentAuth };