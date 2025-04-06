// models/testModel.js
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  test: [{
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  }],
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;