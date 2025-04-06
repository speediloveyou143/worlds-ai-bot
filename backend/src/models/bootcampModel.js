const mongoose = require("mongoose");

const bootcampSchema = new mongoose.Schema({
  days: {
    type: Number,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  courseRoadmap: {
    type: [[String]], // Nested arrays of strings
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  instructors: [
    {
      name: String,
      role: String,
      description: String,
    },
  ],
});

const Bootcamp = mongoose.model("Bootcamp", bootcampSchema);
module.exports = Bootcamp;