
import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },

    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    Role: {
      type: String,
      enum: ["admin", "User", "Shop"],
      default: "User",
    },

    // Hashed shop verification code, if your app uses it
    ShopCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Loginmodel = mongoose.model("Login", LoginSchema);

export default Loginmodel;
