const { Alchemy, Network } = require("alchemy-sdk");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const depositService = require("./services/depositService");

dotenv.config();

// Alchemy API settings
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Add your Alchemy API key here
  network: Network.ETH_MAINNET, // Ethereum Mainnet
};

// Initialize Alchemy
const alchemy = new Alchemy(settings);

// Connect to MongoDB
connectDB();

// Start monitoring for deposits
depositService.monitorDeposits(alchemy);

// Server configuration
const PORT = process.env.PORT || 5000;
console.log(`Server running on port ${PORT}`);
