const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  paragraph: {
    type: String,
    required: true,
    trim: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now, 
  },
});
Privacy= mongoose.model("Privacy", privacySchema);
module.exports=Privacy