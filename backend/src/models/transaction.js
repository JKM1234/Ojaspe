import mongoose from "mongoose";

import crypto from "crypto";
const transactionSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MerchantUser",
    required: true,
  },
  accountHolderName:{
   type: String,
   require: true,
  },
  type: {
    type: String,
    enum: ["payin", "payout"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  unique_id:{
  type: String,
  unique: true,
  default:()=> crypto.randomBytes(12).toString("hex"),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
