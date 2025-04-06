const mongoose = require("mongoose");

const successVideosSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  package: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
});

const SuccessVideos = mongoose.model("SuccessVideos", successVideosSchema);

module.exports = SuccessVideos;