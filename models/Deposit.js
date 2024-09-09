const mongoose = require("mongoose");

const DepositSchema = new mongoose.Schema({
  blockNumber: { type: Number, required: true },
  blockTimestamp: { type: Number, required: true },
  fee: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  pubkey: { type: String, required: true },
});

module.exports = mongoose.model("Deposit", DepositSchema);
