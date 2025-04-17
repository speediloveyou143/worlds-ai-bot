const mongoose = require("mongoose");

const skillsSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  subTopics: {
    type: [String],
    required: true,
  },
});

const roadMapSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  tutorName: {
    type: String,
    required: true,
    trim: true,
  },
  tutorDescription: {
    type: String,
    required: true,
    trim: true,
  },
  tutorImageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  skills: {
    type: [skillsSchema],
    required: true,
  },
});

const RoadMap = mongoose.model("RoadMap", roadMapSchema);
module.exports = RoadMap;