import mongoose from "mongoose";

const plumborderSchema = new mongoose.Schema(
  {
    // Product information
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plumbing", // Reference to your Plumbing product model
      required: true,
    },

    ProductName: {
      type: String,
      default: "",
    },

    Brand: {
      type: String,
      default: "",
    },

    Imageurl: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    Discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    Description: {
      type: String,
      default: "",
    },

    // Shop owner: jis seller ka product hai (taake shop owner sirf apne orders dekh sake)
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
      index: true,
    },

    // Customer information
    Name: {
      type: String,
      required: true,
      trim: true,
    },

    phonenumber: {
      type: String,
      required: true,
      trim: true,
    },

    Location: {
      type: String,
      required: true,
      trim: true,
    },

    Date: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const plumborderemodel = mongoose.model("plumborder", plumborderSchema);

export default plumborderemodel;