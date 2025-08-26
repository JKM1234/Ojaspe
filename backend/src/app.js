import express from "express";
import cors from "cors";
import MerchantRoutes from "./routes/merchantRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"
const app = express();

app.get("/",(req,res)=>{
    res.send("Server is running");
})

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5000",
  credentials: true,
}));

// Routes
app.use("/api/merchants", MerchantRoutes);
app.use("/api/transaction", transactionRoutes);

export { app };
