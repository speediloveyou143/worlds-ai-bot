
// models/contactModel.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  offer: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  insta: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  maps: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true, // Assuming the logo is required; change to false if optional
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;