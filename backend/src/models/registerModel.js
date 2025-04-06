const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  
  },
  mobile: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
});

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;