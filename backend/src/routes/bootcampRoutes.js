const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/bootcampModel');
const {userAuth}=require('../middlewares/auth')
const {adminAuth}=require("../middlewares/admin")


router.post('/create-bootcamp',userAuth,adminAuth, async (req, res) => {
    try {
        const { days, courseName, startDate, endDate, startTime, courseRoadmap, videoUrl, instructors } = req.body;

        if (!days || !courseName || !startDate || !endDate || !startTime || !courseRoadmap || !videoUrl || !instructors) {
            return res.status(422).json({ message: "All fields are required..." });
        }

        const bootcamp = new Bootcamp({
            days,
            courseName,
            startDate,
            endDate,
            startTime,
            courseRoadmap,
            videoUrl,
            instructors,
        });

        await bootcamp.save();
        res.status(200).json({ message: "Course bootcamp successfully!", bootcamp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all-bootcamps', async (req, res) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json(bootcamps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/show-bootcamp/:id',async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ message: "Bootcamp not found" });
        }
        res.status(200).json(bootcamp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/update-bootcamp/:id',userAuth,adminAuth,async (req, res) => {
    try {
        const { days, courseName, startDate, endDate, startTime, courseRoadmap, videoUrl, instructors } = req.body;

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
            days,
            courseName,
            startDate,
            endDate,
            startTime,
            courseRoadmap,
            videoUrl,
            instructors,
        }, { new: true });

        if (!bootcamp) {
            return res.status(404).json({ message: "Bootcamp not found" });
        }

        res.status(200).json({ message: "Bootcamp updated successfully!", bootcamp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete-bootcamp/:id',userAuth,adminAuth, async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ message: "Bootcamp not found" });
        }
        res.status(200).json({ message: "Bootcamp deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;