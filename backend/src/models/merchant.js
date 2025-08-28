import mongoose, { Schema } from "mongoose";
import crypto from "crypto"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MerchantSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    merchantUniqueId:{
      type: String,
      unique: true,
      default: function (){
       return "XOjaspe"+crypto.randomBytes(4).toString("hex");
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// for hashing the password before saving it
MerchantSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();

    try {
        this.password= await bcrypt.hash(this.password,10);
        next();
    } catch (error) {
        next(error);
    }
})

// comparing the entered password with hashed password

MerchantSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
};

export const MerchantUser = mongoose.model("MerchantUser", MerchantSchema);