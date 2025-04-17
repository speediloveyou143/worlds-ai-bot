const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure nodemailer (replace with your email service credentials)
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your preferred email service
  auth: {
    user: "keepcodedata@gmail.com", // Your email address
    pass: "glol arah fftj arws", // Your email password or app-specific password
  },
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      number,
      password: hashPassword,
    });

    await user.save();

    res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let dashboard;
    if (user.role === "student") {
      dashboard = "Student Dashboard";
    } else if (user.role === "admin") {
      dashboard = "Admin Dashboard";
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const token = jwt.sign({ id: user._id }, "dream", { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 8 * 3600000),
    });

    return res.status(200).json({
      message: "Sign In successful",
      user: user,
      dashboard,
    });
  } catch (error) {
    console.error("Error in /signin:", error); // Log errors for debugging
    return res.status(500).json({
      message: "Error signing in",
      error: error.message,
    });
  }
});

// Signout route
router.post("/signout", userAuth, (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json("signed out");
});

// Request password reset
router.post("/reset-password-request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, "dream", { expiresIn: "1h" });

    // Save reset token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send reset email
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; // Update with your frontend URL
    const mailOptions = {
      from: "keepcodedata@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in /reset-password-request:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, "dream");
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null; // Clear reset token
    user.resetTokenExpiry = null; // Clear expiry
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in /reset-password:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
});

module.exports = router;