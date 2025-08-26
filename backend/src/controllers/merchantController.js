import { MerchantUser } from "../models/merchant.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// register a merchant
export const registerMerchant = async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, password } = req.body;

    const existingMerchant = await MerchantUser.findOne({ email ,phone});
    if (existingMerchant) {
      return res.status(400).json({
        message: "Merchant user already exist",
      });
    }

    const apiKey = crypto.randomBytes(32).toLocaleString("hex");

    const merchant = await MerchantUser.create({
      companyName,
      contactPerson,
      email,
      phone,
      password,
      apiKey,
    });

    res.status(201).json({
      message: "Merchant registered successfully",
      merchant: {
        id: merchant._id,
        companyName: merchant.companyName,
        email: merchant.email,
        phone: merchant.phone,
        apiKey: merchant.apiKey,
      },
    });
  } catch (error) {
    console.log("Error in registring maybe duplicate entry", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// getting all the merchants code

// src/controllers/merchantController.js
export const getMerchants = async (req, res) => {
  try {
    const merchants = await MerchantUser.find().select("-password"); // do not return password
    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isMerchantExist = await MerchantUser.findOne({ email });
    if (!isMerchantExist) {
      return res.status(400).json({ message: "Merchant not found" });
    }
    const isMatch = await isMerchantExist.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: isMerchantExist._id, email: isMerchantExist.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login succcessfully",
      token,
      isMerchantExist: {
        id: isMerchantExist._id,
        companyName: isMerchantExist.companyName,
        contactPerson: isMerchantExist.contactPerson,
        email: isMerchantExist.email,
        phone: isMerchantExist.phone,
        apiKey: isMerchantExist.apiKey,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logoutMerchant = (req, res) => {
  try {
    // Clear cookie (if JWT stored in cookies)
    res.cookie("merchantToken", "", {
      httpOnly: true,
      expires: new Date(0), 
      secure: false,        // set true if using https
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout successful. Token removed from cookies and client storage.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

