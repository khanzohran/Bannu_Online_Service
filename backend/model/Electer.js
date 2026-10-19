
import mongoose from "mongoose";

const Electerschema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },

    usernumber: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    Problem: {
      type: String,
      required: true,
    },

    Date: {
      type: String,
      default: "",
    },

    Description: {
      type: String,
      default: "",
    },

    electricianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },

    ElectricianName: {
      type: String,
      default: "",
    },

    ElectricianContactNumber: {
      type: String,
      default: "",
    },

    ElectricianShopLocation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Electermodel = mongoose.model("electer", Electerschema);

export default Electermodel;
