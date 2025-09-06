const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
module.exports = connectDB;
