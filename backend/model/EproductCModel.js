
import mongoose from "mongoose";

const ElecterCreateSchema = new mongoose.Schema(
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

    // Product kis shop owner ka hai
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ElecterCreatemodel = mongoose.model(
  "Electrical",
  ElecterCreateSchema
);

export default ElecterCreatemodel;
