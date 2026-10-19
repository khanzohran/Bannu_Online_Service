
import express from "express";
import mongoose from "mongoose";
import Electerorderemodel from "../model/Electerorder.js";
import ElecterCreatemodel from "../model/EproductCModel.js";
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
    const product = await ElecterCreatemodel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
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

    const ordercreateobj = await Electerorderemodel.create(orderData);

    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      ordercreateobj,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Order create failed",
      error: error.message,
    });
  }
});


// ================= FIND ALL ORDERS =================
// Admin ke liye: sab orders

route.get("/orderfindApi", async (req, res) => {
  try {
    const orderfindobj = await Electerorderemodel.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orderfindobj,
    });
  } catch (error) {
    console.error("FIND ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Order find failed",
    });
  }
});


// ================= SELLER'S OWN ORDERS =================
// Sirf logged-in seller ke orders

route.get("/myOrdersApi", authShop, async (req, res) => {
  try {
    const orderfindobj = await Electerorderemodel.find({
      shopOwner: req.shopOwnerId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orderfindobj,
    });
  } catch (error) {
    console.error("MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Could not find your orders",
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

    const Allorderfindone =
      await Electerorderemodel.findById(_id);

    if (!Allorderfindone) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    return res.json({
      success: true,
      Allorderfindone,
    });
  } catch (error) {
    console.error("FIND ONE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Find one order failed",
    });
  }
});


// ================= DELETE ORDER =================
// Admin-only route: is route ko apne admin auth middleware
// se protect karna zaroori hai.

route.post("/orderdeleteApi", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        msg: "Valid order ID is required",
      });
    }

    const deleted =
      await Electerorderemodel.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    return res.json({
      success: true,
      msg: "Order deleted successfully",
      deleted,
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Order delete failed",
    });
  }
});

export default route;
