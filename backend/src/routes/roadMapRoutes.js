const express = require("express");
const router = express.Router();
const RoadMap = require("../models/roadMapModel");

router.post("/create-roadmap", async (req, res) => {
  try {
    const { courseName, skills } = req.body;
    if (!courseName || !skills) {
      return res.status(422).json({ message: "require all fields" });
    }
    const newRoadMap = new RoadMap({
      courseName,
      skills,
    });
    await newRoadMap.save();
    res.status(200).json({ message: "roadmap added successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error adding road map", error: err });
  }
});
router.get("/show-roadmaps", async (req, res) => {
  try {
    const roadmap = await RoadMap.find();
    if (!roadmap) {
      return res.status(404).json({ message: "Road maps not found" });
    }
    res.status(200).json(roadmap);
  } catch (err) {
    res.status(400).json({ message: "Error retrieving road maps", error: err });
  }
});
router.get("/show-roadmap/:id", async (req, res) => {
  try {
    const roadMap = await RoadMap.findById(req.params.id);
    if (!roadMap) {
      return res.status(404).json({ message: "Road map not found" });
    }
    res.status(200).json(roadMap);
  } catch (err) {
    res.status(400).json({ message: "Error retrieving road map", error: err });
  }
});

router.put("/update-roadmap/:id", async (req, res) => {
  try {
    const updatedRoadMap = await RoadMap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRoadMap) {
      return res.status(404).json({ message: "Road map not found" });
    }
    res.status(200).json(updatedRoadMap);
  } catch (err) {
    res.status(400).json({ message: "Error updating road map", error: err });
  }
});

router.delete("/delete-roadmap/:id", async (req, res) => {
  try {
    const{id}=req.params
    console.log(id)
    const deletedRoadMap = await RoadMap.findByIdAndDelete(id);
    if (!deletedRoadMap) {
      return res.status(404).json({ message: "Road map not found" });
    }
    res.status(200).json({ message: "Road map deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting road map", error: err });
  }
});

module.exports = router;
