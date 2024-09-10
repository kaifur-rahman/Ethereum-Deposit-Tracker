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
    console.log("Req received");
    console.log(req.body);
    console.log(req.body.event.activity);

    // Verify signature to ensure the request is from Alchemy
    // if (!verifySignature(req)) {
    //   return res.status(401).send("Unauthorized: Invalid signature");
    // }

    // Extract the activity (list of transactions)
    const activity = req.body.event.activity;

    //----------------------------deomonstration purpose--------------------

    //Temporarily process all transactions for demonstration
    for (const tx of activity) {
      logger.info(`Transaction received: ${tx.hash}`);

      // Send the transaction to depositService for processing
      await depositService.processDeposit(tx);
    }

    //-----------------------------------------------------------------

    // Iterate through the activity array to find ETH transactions to the Beacon Deposit Contract
    //------------------------actual task-------------------------------------
    // for (const tx of activity) {
    //   const toAddress = tx.toAddress;
    //   const beaconContractAddress = process.env.BEACON_CONTRACT;
    //   const assetType = tx.asset; // Check if the asset type is ETH or native

    //   // //   // Only process ETH transactions to the Beacon Deposit Contract
    //   if (
    //     toAddress.toLowerCase() === beaconContractAddress.toLowerCase() &&
    //     (assetType === "ETH" || assetType === "native")
    //   ) {
    //     logger.info(`Beacon contract ETH transaction received: ${tx.hash}`);

    //     //     // Send the relevant transaction to depositService for processing
    //     await depositService.processDeposit(tx);
    //   }
    // }
    //----------------------------------------------------------------------
    // Respond to Alchemy with success status
    res.status(200).send("Webhook received and verified");
  } catch (error) {
    logger.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
