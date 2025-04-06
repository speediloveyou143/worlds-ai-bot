const express = require('express');
const router = express.Router();
const RoadMapTopic = require('../models/roadmapTopicsModel'); // Adjust path as needed

// Create a new roadmap topic
router.post('/create-roadmap-topic', async (req, res) => {
    try {
        const { roadMapName, id } = req.body;
        if (!roadMapName || !id) {
            return res.status(422).json({ message: "All fields are required..." });
        }
        
        const roadMapTopic = new RoadMapTopic({
            roadMapName,
            id
        });
        
        await roadMapTopic.save();
        res.status(200).json({ message: "Roadmap topic created successfully!!" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

// Get all roadmap topics
router.get('/show-roadmap-topic', async (req, res) => {
    try {
        const roadMapTopics = await RoadMapTopic.find();
        res.status(200).json(roadMapTopics);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get a specific roadmap topic by ID
router.get('/show-roadmap-topic/:id', async (req, res) => {
    try {
        const roadMapTopic = await RoadMapTopic.findById(req.params.id);
        if (!roadMapTopic) {
            return res.status(404).json({ message: "Roadmap topic not found" });
        }
        res.status(200).json(roadMapTopic);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Update a roadmap topic
router.patch('/update-roadmap-topic/:id', async (req, res) => {
    try {
        const { roadMapName, id: roadMapId } = req.body;
        const roadMapTopic = await RoadMapTopic.findByIdAndUpdate(
            req.params.id, 
            { roadMapName, id: roadMapId }, 
            { new: true }
        );
        
        if (!roadMapTopic) {
            return res.status(404).json({ message: "Roadmap topic not found" });
        }
        res.status(200).json(roadMapTopic);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Delete a roadmap topic
router.delete('/delete-roadmap-topic/:id', async (req, res) => {
    try {
        const roadMapTopic = await RoadMapTopic.findByIdAndDelete(req.params.id);
        if (!roadMapTopic) {
            return res.status(404).json({ message: "Roadmap topic not found" });
        }
        res.status(200).json({ message: "Roadmap topic deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;