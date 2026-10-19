import express from "express";
import sellermodel from "../model/Seller.js";

const route = express.Router();

// ================= CREATE SELLER =================
route.post("/sellercreateApi", async (req, res) => {
  try {
    const data = req.body;

    const sellercreateobj = await sellermodel.create(data);

    return res.status(201).json({
      success: true,
      msg: "Seller created successfully",
      sellercreateobj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Seller create API failed",
      error: error.message,
    });
  }
});

// ================= FIND ALL SELLERS =================
route.get("/sellerfineApi", async (req, res) => {
  try {
    const sellerfineobj = await sellermodel.find();

    return res.status(200).json({
      success: true,
      msg: "Seller find API is working",
      sellerfineobj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Seller find API failed",
      error: error.message,
    });
  }
});

// ================= FIND ONE SELLER =================
route.post("/sellerfindoneApi", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Seller ID is required",
      });
    }

    const sellerfindoneobj = await sellermodel.findById(id);

    if (!sellerfindoneobj) {
      return res.status(404).json({
        success: false,
        msg: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Seller found successfully",
      sellerfindoneobj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Seller find-one API failed",
      error: error.message,
    });
  }
});

// ================= DELETE SELLER =================
route.post("/selledeleteApi", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Seller ID is required",
      });
    }

    const sellerdeleteobj = await sellermodel.findByIdAndDelete(id);

    if (!sellerdeleteobj) {
      return res.status(404).json({
        success: false,
        msg: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Seller deleted successfully",
      sellerdeleteobj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Seller delete API failed",
      error: error.message,
    });
  }
});

export default route;