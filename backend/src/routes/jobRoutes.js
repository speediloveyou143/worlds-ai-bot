// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/jobModel');

// Create a new job
router.post('/create-job', async (req, res) => {
    try {
        const { experience, jobRole, workType } = req.body;
        if (!experience || !jobRole || !workType) {
            return res.status(422).json({ message: "All fields are required..." });
        }
        
        const job = new Job({
            experience,
            jobRole,
            workType
        });
        
        await job.save();
        res.status(200).json({ message: "Job created successfully!!" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

// Get all jobs
router.get('/show-jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get a specific job by ID
router.get('/show-job/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Update a job
router.patch('/update-job/:id', async (req, res) => {
    try {
        const { experience, jobRole, workType } = req.body;
        const job = await Job.findByIdAndUpdate(
            req.params.id, 
            { experience, jobRole, workType }, 
            { new: true }
        );
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Delete a job
router.delete('/delete-job/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;