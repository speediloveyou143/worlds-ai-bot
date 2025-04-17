const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).json('Please login, token expired');

    const { id } = jwt.verify(token, "dream");
    const user = await User.findById(id);

    if (!user) return res.status(404).json("User not found");

    // Check if user role is admin
    if (user.role !== "admin") return res.status(403).json("Access denied. Admin only.");

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { adminAuth };