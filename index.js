const express = require("express");
const crypto = require("crypto"); // For verifying the signature
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const depositService = require("./services/depositService");

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON payloads

// Connect to MongoDB
connectDB();

// Alchemy signing key from environment variables
const ALCHEMY_SIGNING_KEY = process.env.ALCHEMY_SIGNING_KEY;

// Function to verify the HMAC signature from Alchemy
const verifySignature = (req) => {
  const receivedSignature = req.headers["x-alchemy-signature"];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", ALCHEMY_SIGNING_KEY);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");
  return receivedSignature === calculatedSignature;
};

// Webhook route to handle deposit notifications from Alchemy
app.post("/api/webhook", async (req, res) => {
  try {
    // Verify signature to ensure the request is from Alchemy
    if (!verifySignature(req)) {
      return res.status(401).send("Unauthorized: Invalid signature");
    }

    // Process the transaction payload if the signature is valid
    const transaction = req.body;
    logger.info("Webhook received and verified:", transaction);

    // Send transaction to depositService for processing
    await depositService.processDeposit(transaction);

    // Respond to Alchemy with success status
    res.status(200).send("Webhook received and verified");
  } catch (error) {
    logger.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

//middleware will fetch data from MongoDB and serve it in a format that Grafana can read, such as time-series data.
app.post("/api/grafana-query", async (req, res) => {
  try {
    const { range } = req.body; // Grafana sends a time range for the query

    const db = await connectDB();
    const deposits = db.collection("deposits");

    // Query deposits based on the given time range
    const results = await deposits
      .find({
        blockTimestamp: {
          $gte: new Date(range.from).getTime() / 1000, // Convert ISO date to timestamp
          $lte: new Date(range.to).getTime() / 1000,
        },
      })
      .toArray();

    // Prepare the response for Grafana
    const data = results.map((deposit) => ({
      target: `Deposit ${deposit.hash}`, // Series name
      datapoints: [[parseFloat(deposit.value), deposit.blockTimestamp * 1000]], // Value, timestamp
    }));

    res.json(data);
  } catch (error) {
    logger.error("Error fetching data for Grafana:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
