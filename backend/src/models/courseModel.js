const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  nextId:{
    type: String,
    required: true,
    trim: true,
  },
  recordingId:{
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  price:{
    type:Number,
    required:true,
    default:2999
  },
  duration:{
    type:Number,
    required:true
  },
  enrolled:{
    type:Number,
    required:true,
    default:1000
  },
  status:{
    type:String,
    required:true
  },
  badge:{
    type:String,
    default:"Best seller",
    trim:true,
    required:true
  },
  hours:{
    type:Number,
    required:true
  }
 

});

const Course=mongoose.model('Course',courseSchema)

module.exports=Course
