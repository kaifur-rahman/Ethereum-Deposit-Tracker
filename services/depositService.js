const Deposit = require("../models/Deposit");
const logger = require("../utils/logger");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Sends Telegram Notification
const sendTelegramNotification = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
    if (!res.ok) throw new Error("Failed to send notification");
    console.log("Telegram notification sent");
  } catch (error) {
    console.error("Error sending Telegram notification:", error.message);
  }
};

const processDeposit = async (transaction) => {
  try {
    // Check if the deposit has already been processed
    const existingDeposit = await Deposit.findOne({ hash: transaction.hash });
    if (existingDeposit) {
      logger.info(
        `Deposit already processed for transaction: ${transaction.hash}`
      );
      return; // Skip processing if deposit is already in the database
    }

    // Calculate fee (if available) or set default value
    const fee =
      transaction.gasUsed && transaction.gasPrice
        ? (transaction.gasUsed * transaction.gasPrice) / 10 ** 18 // Convert to ETH from wei
        : "0"; // Fallback if no fee is provided

    const depositData = {
      blockNumber: parseInt(transaction.blockNum, 16), // Convert hex block number to decimal
      blockTimestamp: transaction.timestamp || Date.now(), // Use current time if timestamp not available
      fee, // Correctly set fee
      hash: transaction.hash,
      pubkey: transaction.fromAddress, // Use fromAddress as the public key
    };

    // Upsert (update if exists, insert if not)
    const newDeposit = await Deposit.findOneAndUpdate(
      { hash: transaction.hash }, // Find by hash
      depositData, // Data to update or insert
      { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert option
    );

    // Send Telegram notification
    const message = `New ETH Deposit:\nHash: ${transaction.hash}\nFrom: ${transaction.fromAddress}\nAmount: ${transaction.value}`;
    sendTelegramNotification(message);

    logger.info("Deposit processed:", newDeposit);
  } catch (err) {
    logger.error("Error processing deposit:", err);
    throw err;
  }
};
module.exports = { processDeposit };
