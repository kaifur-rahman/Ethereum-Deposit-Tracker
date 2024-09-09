const Deposit = require("../models/Deposit");
const logger = require("../utils/logger");

const beaconContractAddress = process.env.BEACON_CONTRACT;

// Function to monitor Ethereum deposits using Alchemy
const monitorDeposits = (alchemy) => {
  console.log("Listening for ETH deposits...");

  // Subscribe to new blocks on the Ethereum network
  alchemy.ws.on("block", async (blockNumber) => {
    console.log(`New block received: ${blockNumber}`);

    try {
      // Get all the transactions in the block
      const block = await alchemy.core.getBlockWithTransactions(blockNumber);

      block.transactions.forEach(async (tx) => {
        // Check if the transaction is directed to the Beacon Deposit Contract
        if (
          tx.to &&
          tx.to.toLowerCase() === beaconContractAddress.toLowerCase()
        ) {
          console.log("Deposit transaction detected:", tx);

          const fee = tx.gasLimit.mul(tx.gasPrice);

          const depositData = {
            blockNumber: tx.blockNumber,
            blockTimestamp: block.timestamp,
            fee: fee.toString(),
            hash: tx.hash,
            pubkey: tx.from,
          };

          // Save to MongoDB
          const newDeposit = new Deposit(depositData);
          await newDeposit.save();
          console.log("Deposit saved:", newDeposit);
        }
      });
    } catch (err) {
      logger.error("Error tracking deposit:", err);
    }
  });
};

module.exports = { monitorDeposits };

