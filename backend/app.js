import "dotenv/config"; // SABSE PEHLI LINE, baqi imports se pehle

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConection from "./database/dbConnection.js";
import Loginroute from "./Router/Login.route.js";
import Electerroute from "./Router/Electer.route.js";
import Plumberroute from "./Router/Plumber.route.js";
import EPcreateroute from "./Router/EPcrerate.route.js";
import PPcreateroute from "./Router/PPcreate.route.js";
//import CompessDB from "./database/compess,dbConnection.js";
import Electerorder from "./Router/Electerorder.route.js";
import plumborderroute from "./Router/plumborder.route.js";
import sellerroute from "./Router/Selller.route.js"
import workerroute from "./Router/worker.route.js"

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://bannu-online-service-xsrn.vercel.app",
  "http://localhost:5173",
].filter(Boolean).map((origin) => origin.replace(/\/+$/, ""));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // routes se pehle

dbConection();
//CompessDB()

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend connected successfully" });
});

app.use("/Login", Loginroute);
app.use("/Electer", Electerroute);
app.use("/Plumber", Plumberroute);
app.use("/EPcreate", EPcreateroute);
app.use("/PPcreate", PPcreateroute);
app.use("/Electerorder", Electerorder);
app.use("/plumborder", plumborderroute);
app.use("/sellerroute",sellerroute)
app.use("/workerroute",workerroute)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});