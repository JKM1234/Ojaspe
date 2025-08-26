import express from "express";
import { registerMerchant, loginMerchant, getMerchants , logoutMerchant} from "../controllers/merchantController.js";

const router = express.Router();

router.post("/register", registerMerchant);
router.post("/login", loginMerchant);
router.post("/logout", logoutMerchant); 
router.get("/", getMerchants);

export default router;
