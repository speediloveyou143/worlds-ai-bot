const express = require("express");
const router = express.Router();
const Course = require("../models/courseModel");
const {userAuth}=require('../middlewares/auth')
const {adminAuth}=require("../middlewares/admin")

router.post("/create-course",userAuth,adminAuth, async (req, res) => {
    const {courseName,imageUrl,price,duration,enrolled,status,badge,hours,nextId} = req.body;
    try {
        if (!courseName || !imageUrl || !price || !duration || !enrolled || !status || !badge || !hours || !nextId || !recordingId) {
            return res.status(422).json({message: "require both title and image url"});
        }
        const course = new Course({
            courseName,
            imageUrl,
            price,
            duration,
            enrolled,
            status,
            badge,
            hours,
            nextId,
            recordingId
        });
        await course.save();
        res.status(200).json({message: "course created !!"});
    } catch (err) {
        return res.status(500).json({message: err});
    }
});

router.get("/show-course/:id",async (req, res) => {
    try {
      const CourseData = await Course.findById(req.params.id);
      if (!CourseData) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(CourseData);
    } catch (err) {
      res.status(400).json({ message: "Error retrieving Course", error: err });
    }
});

router.get("/show-courses",async(req,res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({message: "courses fetched successfully", data: courses});
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.patch("/update-course/:id",userAuth,userAuth, async (req, res) => {
    const {
      courseName,
      imageUrl,
      price,
      duration,
      enrolled,
      status,
      badge,
      hours,
      nextId,
      recordingId
    } = req.body;
    const { id } = req.params;
  
    if (!id) {
      return res.status(422).json({ message: "ID is required..." });
    }
  
    if (
      !courseName ||
      !imageUrl ||
      !price ||
      !status ||
      !enrolled ||
      !badge ||
      !hours ||
      !nextId ||
      !recordingId
    ) {
      return res.status(422).json({ message: "All fields are required..." });
    }
  
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
          id,
          {
            courseName,
            imageUrl,
            price,
            duration,
            enrolled,
            status,
            badge,
            hours,
            nextId,
            recordingId
          },
          { new: true, runValidators: true }
        );
      
        if (!updatedCourse) {
          return res.status(404).json({ message: "Course not found" });
        }
      
        res.status(200).json({
          message: "Course updated successfully",
          updatedCourse,
        });
      } catch (error) {
        console.error("Error during course update:", error);  // Log the error details
        res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
      
});

router.delete("/delete-course/:id",userAuth,userAuth, async (req, res) => {
    const {id} = req.params;
    try {
        if (!id) {
            res.status(422).json({message: "ID is required"});
        }

        const deleteCourse = await Course.findByIdAndDelete(id);
        if (! deleteCourse) {
            res.status(404).json({message: "course not found"});
        }
        res.status(200).json({message: "course deleted"});
    } catch (err) {
        res.status(500).json({message: err});
    }
});

module.exports = router;
