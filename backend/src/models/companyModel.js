const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  logo:{
    type: String,
    required: true,
    trim: true,
  }
 

});

const Company=mongoose.model('Company',companySchema)

module.exports=Company
