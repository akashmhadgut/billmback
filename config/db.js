const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected to:", mongoose.connection.name);
    console.log("MongoDB Host:", mongoose.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
