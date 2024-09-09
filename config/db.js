const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process if unable to connect
  }
};

module.exports = connectDB;
