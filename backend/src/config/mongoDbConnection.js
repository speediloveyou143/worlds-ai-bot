const mongoose = require("mongoose");

async function connectDb() {
  try {
    const db_url = "mongodb://127.0.0.1:27017/mydatabase";
    await mongoose.connect(db_url);
    console.log("mongo db connected");
  } catch (err) {
    console.log("db not connected", err);
  }
}

module.exports = connectDb;
