const express = require('express');
const router = express.Router();
const Privacy = require('../models/privacyModel');
const {userAuth}=require('../middlewares/auth')
const {adminAuth}=require("../middlewares/admin")


router.post('/create-privacy',userAuth,adminAuth, async (req, res) => {
    try {
        const { heading, paragraph } = req.body;
        if (!heading || !paragraph) {
            return res.status(422).json({ message: "Heading and paragraph are required." });
        }
        const privacy = new Privacy({ heading, paragraph });
        await privacy.save();
        res.status(200).json({ message: "Privacy entry created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/show-privacies', async (req, res) => {
    try {
        const privacies = await Privacy.find();
        res.status(200).json(privacies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/show-privacy/:id',userAuth,adminAuth, async (req, res) => {
    try {
        const privacy = await Privacy.findById(req.params.id);
        if (!privacy) {
            return res.status(404).json({ message: "Privacy entry not found." });
        }
        res.status(200).json(privacy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/update-privacy/:id',userAuth,adminAuth, async (req, res) => {
    try {
        const { heading, paragraph } = req.body;
        if (!heading || !paragraph) {
            return res.status(422).json({ message: "Heading and paragraph are required." });
        }
        const updatedPrivacy = await Privacy.findByIdAndUpdate(
            req.params.id,
            { heading, paragraph, lastUpdated: Date.now() },
            { new: true }
        );
        if (!updatedPrivacy) {
            return res.status(404).json({ message: "Privacy entry not found." });
        }
        res.status(200).json(updatedPrivacy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete-privacy/:id',userAuth,adminAuth, async (req, res) => {
    try {
        const privacy = await Privacy.findByIdAndDelete(req.params.id);
        if (!privacy) {
            return res.status(404).json({ message: "Privacy entry not found." });
        }
        res.status(200).json({ message: "Privacy entry deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
