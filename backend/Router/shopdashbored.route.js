import express from "express";
import { verifyRole } from "../middleware/authshop.js";
import Loginmodel from "../model/Login.js";

// apne asal model ke naam aur import path likho
import EproductCModel from "../model/EproductCModel.js";
import PproductC from "../model/PproductC.js";
import Electerorder from "../model/Electerorder.js";
import plumborder from "../model/plumborder.js";
import Electer from "../model/Electer.js";     // electrician booking model
import Plumber from "../model/Plumber.js";   // plumber booking model

const route = express.Router();

// sirf Shop role is route ko use kar sakta hai
route.get("/dashboard", verifyRole("Shop"), async (req, res) => {
  try {
    const shopId = req.user.id;

    const [shop, eProducts, pProducts, eOrders, pOrders, eBookings, pBookings] =
      await Promise.all([
        Loginmodel.findById(shopId).select("Name Email Role").lean(),
        EproductCModel.find({ shopId }).lean(),
        PproductC.find({ shopId }).lean(),
        Electerorder.find({ shopId }).lean(),
        plumborder.find({ shopId }).lean(),
        Electer.find().lean(),
        Plumber.find().lean(),
      ]);

    return res.json({
      success: true,
      shop,
      products: [
        ...eProducts.map((p) => ({ ...p, category: "Electrical" })),
        ...pProducts.map((p) => ({ ...p, category: "Plumbing" })),
      ],
      orders: [
        ...eOrders.map((o) => ({ ...o, category: "Electrical" })),
        ...pOrders.map((o) => ({ ...o, category: "Plumbing" })),
      ],
      bookings: [
        ...eBookings.map((b) => ({ ...b, category: "Electrician" })),
        ...pBookings.map((b) => ({ ...b, category: "Plumber" })),
      ],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default route;