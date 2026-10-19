import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    // Worker Name
    Name: {
      type: String,
      required: true,
      trim: true,
    },

    // Worker Image
    Image: {
      type: String,
      default: "",
    },

    // Contact Number
    ContactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Worker Description
    Description: {
      type: String,
      default: "",
      trim: true,
    },

    // Worker Type: Electrician
    Electrician: {
      type: Boolean,
      default: false,
    },

    // Worker Type: Plumber
    Plumber: {
      type: Boolean,
      default: false,
    },

    // Shop Owner ID: kis Shop account ka worker hai
    OurShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
      index: true,
    },

    // Shop Location
    ShopLocation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for shop-wise worker searches
WorkerSchema.index({
  OurShop: 1,
  Electrician: 1,
  Plumber: 1,
});

const Workermodel = mongoose.model("Worker", WorkerSchema);

export default Workermodel;