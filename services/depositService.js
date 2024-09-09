const Deposit = require("../models/Deposit");
const logger = require("../utils/logger");

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

    logger.info("Deposit saved:", newDeposit);
  } catch (err) {
    logger.error("Error processing deposit:", err);
    throw err; // Propagate error
  }
};

module.exports = { processDeposit };
