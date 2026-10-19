import mongoose from "mongoose";

const plumbercreateSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
      trim: true,
    },

    Description: {
      type: String,
      default: "",
    },

    Imageurl: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    size: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    Discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    Brand: {
      type: String,
      default: "",
    },

    Location: {
      type: String,
      default: "",
    },

    // Ye field ensure karegi ke product kis shop owner ka hai
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Ye automatically createdAt aur updatedAt add kar dega (Date string ki zaroorat nahi padegi)
  }
);

const plumbercreatemodel = mongoose.model("Plumbing", plumbercreateSchema);

export default plumbercreatemodel;