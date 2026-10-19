import express from "express";
import Plumbermodel from "../model/Plumber.js";

const route = express.Router();

// ================= CREATE BOOKING =================

route.post("/PbookApi", async function (req, res) {
    try {
    let Data = req.body;

    let plumber = await Plumbermodel.create(Data);

    return res.json({
      success: true,
      msg: "The plumber booking API is working",
      plumber: plumber,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Booking failed",
      error: error.message,
    });
  }
});


// ================= FIND ALL BOOKINGS =================

route.get("/Pbookfindapi", async function (req, res) {
  try {
    let plumberfind = await Plumbermodel.find();

    return res.json({
      success: true,
      msg: "Find API is working",
      plumberfind: plumberfind,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Data not found",
      error: error.message,
    });
  }
});


// ================= FIND ONE BOOKING =================

route.post("/findoneapi", async function (req, res) {
  try {
    let findone = req.body;

    let pumberfindone = await Plumbermodel.findOne({
      _id: findone.id,
    });

    return res.json({
      success: true,
      msg: "The find one API is working",
      pumberfindone: pumberfindone,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Find one failed",
      error: error.message,
    });
  }
});


// ================= UPDATE BOOKING =================

route.post("/updateapi", async function (req, res) {
  try {
    let update = req.body;

    await Plumbermodel.findOneAndUpdate(
      {
        _id: update.id,
      },
      {
        ...update,
      }
    );

    return res.json({
      success: true,
      msg: "The update API is working",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Update failed",
      error: error.message,
    });
  }
});


// ================= DELETE BOOKING =================

route.post("/deleteapi", async function (req, res) {
  try {
    let Delete = req.body;

    await Plumbermodel.findOneAndDelete({
      _id: Delete.id,
    });

    return res.json({
      success: true,
      msg: "The delete API is working",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Delete failed",
      error: error.message,
    });
  }
});


export default route;