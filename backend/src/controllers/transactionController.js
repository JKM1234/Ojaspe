import { Transaction } from "../models/transaction.js";


// post to add new transactions in merchant

export const addTransaction = async (req, res) => {
  try {
    const merchantId = req.merchant.id; // comes from authenticateMerchant middleware
    const { amount, type, status, accountHolderName } = req.body;
    
    if(!accountHolderName || !amount || !type){
      return res.status(400).json({
       message: "Required fields are missing for add payments"
      });
    }

    const transaction = await Transaction.create({
      merchant: merchantId,
      accountHolderName,
      amount,
      type,
      status,
    });
    
    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    // req.merchant is set by JWT middleware
    const merchantId = req.merchant.id;
    const transactions = await Transaction.find({
        merchant:merchantId
    });
    res.status(200).json({
      message:"Transaction fetched successfully",
      merchant: req.merchant.companyName,
      apiKey: req.merchant.apiKey,
      total: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};