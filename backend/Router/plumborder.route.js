import express from "express";
import mongoose from "mongoose";
import plumborderemodel from "../model/plumborder.js";
import plumbercreatemodel from "../model/PproductC.js";
import authShop from "../middleware/authshop.js";

const route = express.Router();

// ================= CREATE ORDER =================
// Customer productId bhejega.
// Product aur shopOwner database se liye jayenge.

route.post("/ordercreateApi", async (req, res) => {
  try {
    const {
      productId,
      Name,
      stock,
      Location,
      size,
      phonenumber,
      Date,
    } = req.body;

    if (!productId || !Name?.trim() || !Location?.trim() || !phonenumber?.trim()) {
      return res.status(400).json({
        success: false,
        msg: "Name, location, phone number and product ID are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product ID",
      });
    }

    const quantity = Number(stock);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        msg: "Quantity must be at least 1",
      });
    }

    // Product database se find karo
    const product = await plumbercreatemodel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Plumber product not found",
      });
    }

    // Shop owner frontend se nahi, product database se liya jayega
    if (!product.shopOwner) {
      return res.status(400).json({
        success: false,
        msg: "This product has no shop owner assigned",
      });
    }

    const orderData = {
      productId: product._id,
      ProductName: product.ProductName,
      Brand: product.Brand,
      Imageurl: product.Imageurl,
      price: product.price,
      Discount: Number(product.Discount || 0),
      Description: product.Description,

      shopOwner: product.shopOwner,

      Name: Name.trim(),
      stock: quantity,
      Location: Location.trim(),
      size: size || "",
      phonenumber: phonenumber.trim(),
      Date: Date || "",
    };

    const ordercreateobj = await plumborderemodel.create(orderData);

    return res.status(201).json({
      success: true,
      msg: "Plumber order placed successfully",
      ordercreateobj,
    });
  } catch (error) {
    console.error("PLUMBER CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Plumber order create failed",
      error: error.message,
    });
  }
});


// ================= FIND ALL ORDERS =================
// Admin ke liye: sab orders

route.get("/orderfindApi", async (req, res) => {
  try {
    const orderfindobj = await plumborderemodel.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orderfindobj,
    });
  } catch (error) {
    console.error("PLUMBER FIND ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Plumber order find failed",
    });
  }
});


// ================= SELLER'S OWN ORDERS =================
// Sirf logged-in seller ke orders

route.get("/myOrdersApi", authShop, async (req, res) => {
  try {
    const orderfindobj = await plumborderemodel.find({
      shopOwner: req.shopOwnerId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orderfindobj,
    });
  } catch (error) {
    console.error("PLUMBER MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Could not find your plumbing orders",
    });
  }
});


// ================= FIND ONE ORDER =================

route.post("/orderfindoneApi", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        msg: "Valid order ID is required",
      });
    }

    const Allorderfindone = await plumborderemodel.findById(_id);

    if (!Allorderfindone) {
      return res.status(404).json({
        success: false,
        msg: "Plumber order not found",
      });
    }

    return res.json({
      success: true,
      Allorderfindone,
    });
  } catch (error) {
    console.error("PLUMBER FIND ONE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Find one plumber order failed",
    });
  }
});


// ================= DELETE ORDER =================

route.post("/orderdeleteApi", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        msg: "Valid order ID is required",
      });
    }

    const deleted = await plumborderemodel.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        msg: "Plumber order not found",
      });
    }

    return res.json({
      success: true,
      msg: "Plumber order deleted successfully",
      deleted,
    });
  } catch (error) {
    console.error("PLUMBER DELETE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Plumber order delete failed",
    });
  }
});

export default route;