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
    // Extract relevant data from the transaction
    const depositData = {
      blockNumber: transaction.blockNumber,
      blockTimestamp: transaction.timestamp,
      fee: transaction.gas * transaction.gasPrice, // Calculate fee
      hash: transaction.hash,
      pubkey: transaction.from,
    };

    // Save the deposit to MongoDB
    const newDeposit = new Deposit(depositData);
    await newDeposit.save();
    // Send Telegram notification
    const message = `New ETH Deposit:\nHash: ${tx.hash}\nFrom: ${tx.from}\nAmount: ${tx.value}`;
    sendTelegramNotification(message);

    logger.info("Deposit saved:", newDeposit);
  } catch (err) {
    logger.error("Error processing deposit:", err);
    throw err; // Propagate error
  }
};

module.exports = { processDeposit };
