import express from "express";
import { addTransaction, getMyTransactions } from "../controllers/transactionController.js";
import { authenticateMerchant } from "../middlewares/auth.js";

const router = express.Router();

// GET all transactions for logged-in merchant
router.get("/my", authenticateMerchant, getMyTransactions);

router.post("/add",authenticateMerchant,addTransaction);
export default router;
