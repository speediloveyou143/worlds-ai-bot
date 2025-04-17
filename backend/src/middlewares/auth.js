const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token)

    if (!token) return res.status(401).json('Please login, token expired');

    const { id } = jwt.verify(token, "dream");
    const user = await User.findById(id);

    if (!user) return res.status(404).json("User not found");

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { userAuth };
