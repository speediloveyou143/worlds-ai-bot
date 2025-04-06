// models/jobModel.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  experience: {
    type: String,
    required: true,
    trim: true,
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
  },
  workType: {
    type: String,
    required: true,
    enum: ['onsite', 'remote', 'hybrid'], // Restricts to these values
    trim: true,
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;