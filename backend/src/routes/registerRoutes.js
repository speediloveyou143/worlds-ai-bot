const express = require('express');
const router = express.Router();
const Register = require('../models/registerModel'); 

router.post('/create-register', async (req, res) => {
    try {
        const { name, email, mobile, country, state, course } = req.body;

        if (!name || !email || !mobile || !country || !state || !course) {
            return res.status(422).json({ message: "All fields are required..." });
        }
        const register = new Register({
            name,
            email,
            mobile,
            country,
            state,
            course,
        });

        await register.save();
        res.status(200).json({ message: "User registered successfully!", register });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all-registers', async (req, res) => {
    try {
        const registers = await Register.find();
        res.status(200).json(registers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete-register/:id', async (req, res) => {
    try {
        const register = await Register.findByIdAndDelete(req.params.id);
        if (!register) {
            return res.status(404).json({ message: "register not found" });
        }
        res.status(200).json({ message: "register deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;