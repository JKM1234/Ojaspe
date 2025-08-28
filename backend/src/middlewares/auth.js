import jwt from "jsonwebtoken";
import { MerchantUser } from "../models/merchant.js";

export const authenticateMerchant = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } 
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const merchant = await MerchantUser.findById(decoded.id);
    if (!merchant) return res.status(401).json({ message: "Invalid token" });

    req.merchant = merchant;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
