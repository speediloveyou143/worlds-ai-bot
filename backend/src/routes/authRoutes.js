const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {userAuth}=require('../middlewares/auth')
const jwt=require('jsonwebtoken')

const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !number || !password) {
       return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser){
       return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword=await bcrypt.hash(password,10)
    const user = new User({
      name,
      email,
      number,
      password:hashPassword,
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
      user:user,
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


router.post("/signout",userAuth,(req,res)=>{
    res.cookie("token",null,{
      expires:new Date(Date.now())
    })
    res.json("signed out")
})


module.exports = router;
