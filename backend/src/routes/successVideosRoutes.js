const express = require('express');
const router = express.Router();
const SuccessVideos = require('../models/successVideosModel');

router.post('/create-video', async (req, res) => {
    try {
        const { videoUrl, jobRole, name, package, companyName } = req.body;
        if (!videoUrl || !jobRole || !name || !package || !companyName) {
            return res.status(422).json({ message: "All fields are required..." });
        }
        const successVideo = new SuccessVideos({ videoUrl, jobRole, name, package, companyName });
        await successVideo.save();
        res.status(200).json({ message: "Success video created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/show-videos', async (req, res) => {
    try {
        const videos = await SuccessVideos.find();
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/show-video/:id', async (req, res) => {
    try {
        const video = await SuccessVideos.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/update-video/:id', async (req, res) => {
    try {
        const { videoUrl, jobRole, name, package, companyName } = req.body;
        const video = await SuccessVideos.findByIdAndUpdate(
            req.params.id,
            { videoUrl, jobRole, name, package, companyName },
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete-video/:id', async (req, res) => {
    try {
        const video = await SuccessVideos.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;