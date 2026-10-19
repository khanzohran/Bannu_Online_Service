
import express from "express";
import Electermodel from "../model/Electer.js";

const route = express.Router();

// CREATE BOOKING
route.post("/EbookApi", async (req, res) => {
  try {
    const elec = await Electermodel.create(req.body);

    return res.status(201).json({
      success: true,
      msg: "Electrician booking successfully saved",
      elec,
    });
  } catch (error) {
    console.error("Booking save error:", error);

    return res.status(500).json({
      success: false,
      msg: "Booking failed",
      error: error.message,
    });
  }
});

// FIND ALL BOOKINGS
route.get("/Allbookapi", async (req, res) => {
  try {
    const Efind = await Electermodel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      msg: "Electrician bookings fetched successfully",
      Efind,
    });
  } catch (error) {
    console.error("Booking fetch error:", error);

    return res.status(500).json({
      success: false,
      msg: "Bookings fetch nahi ho sakin",
      error: error.message,
    });
  }
});

export default route;
