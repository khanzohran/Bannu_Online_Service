import Loginmodel from "../model/Login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

let route = express.Router();

const ALLOWED_ROLES = ["admin", "User", "Shop"];

// Cookie ki settings (JS se cookie nahi padhi ja sakti)
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
};

function makeToken(user) {
  return jwt.sign(
    { id: user._id, Role: user.Role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ================= SIGNUP =================

route.post("/SignApi", async function (req, res) {
  try {
    let { Name, Email, password, Role, AccessCode } = req.body;

    if (!Name || !Email || !password || !Role) {
      return res.json({ success: false, msg: "Sab fields zaroori hain" });
    }

    // Role sirf in 3 mein se ho sakta hai
    if (!ALLOWED_ROLES.includes(Role)) {
      return res.json({ success: false, msg: "Role galat hai" });
    }

    // Email check
    let existingEmail = await Loginmodel.findOne({ Email: Email });
    if (existingEmail) {
      return res.json({
        success: false,
        msg: "The user on this email is already present",
      });
    }

    // Admin check: sirf EK admin
    if (Role === "admin") {
      let existingAdmin = await Loginmodel.findOne({ Role: "admin" });
      if (existingAdmin) {
        return res.json({ success: false, msg: "One admin is already present" });
      }
    }

    // Shop: kitne bhi ban sakte hain, har Shop ka apna code zaroori
    let shopCodeHash = null;
    if (Role === "Shop") {
      if (!AccessCode || AccessCode.length < 6) {
        return res.json({
          success: false,
          msg: "Shop code kam az kam 6 characters ka rakho",
        });
      }

      shopCodeHash = await bcrypt.hash(AccessCode, 10);
    }

    // Password hash
    let hashgpassword = await bcrypt.hash(password, 10);

    // Create user
    let storedData = await Loginmodel.create({
      Name,
      Email,
      password: hashgpassword,
      Role,
      ShopCode: shopCodeHash,
    });

    // Token + cookie
    res.cookie("Final-project", makeToken(storedData), cookieOptions);

    return res.json({
      success: true,
      msg: "The API is working",
      data: {
        Name: storedData.Name,
        Email: storedData.Email,
        Role: storedData.Role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});

// ================= LOGIN =================

route.post("/loginApi", async function (req, res) {
  try {
    let { Email, password, Role, AccessCode } = req.body;

    let existingData = await Loginmodel.findOne({
      Email: Email,
      Role: Role,
    });

    if (!existingData) {
      return res.json({ success: false, msg: "Email or Role is not correct" });
    }

    let result = await bcrypt.compare(password, existingData.password);
    if (!result) {
      return res.json({ success: false, msg: "The password is not correct" });
    }

    // Shop ke liye us Shop ka apna code check hota hai
    if (existingData.Role === "Shop") {
      if (!AccessCode) {
        return res.json({ success: false, msg: "Shop code likhna zaroori hai" });
      }

      let codeOk = await bcrypt.compare(AccessCode, existingData.ShopCode || "");
      if (!codeOk) {
        return res.json({ success: false, msg: "Shop code galat hai" });
      }
    }

    res.cookie("Final-project", makeToken(existingData), cookieOptions);

    return res.json({
      success: true,
      msg: "The user is logged in",
      Role: existingData.Role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});

// ================= LOGOUT =================

route.post("/logoutApi", function (req, res) {
  res.clearCookie("Final-project", cookieOptions);
  return res.json({ success: true, msg: "Logged out" });
});

// ================= ADMIN EXISTS (signup dropdown ke liye) =================

route.get("/AdminExists", async function (req, res) {
  res.json({ adminExists: !!(await Loginmodel.exists({ Role: "admin" })) });
});

// ================= ROLE CHECKS (admin / User / Shop) =================

function makeRoleCheck(requiredRole) {
  return function (req, res) {
    try {
      let token = req.cookies["Final-project"];

      if (!token) {
        return res.json({ success: false, msg: "The token is not found" });
      }

      let data = jwt.verify(token, process.env.JWT_SECRET);

      if (data.Role !== requiredRole) {
        return res.json({
          success: false,
          msg: "The logged-in user is not " + requiredRole,
        });
      }

      return res.json({ success: true, msg: "The user is correctly logged in" });
    } catch (error) {
      return res.status(401).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }
  };
}

route.get("/adminCheck", makeRoleCheck("admin"));
route.get("/userCheck", makeRoleCheck("User"));
route.get("/shopCheck", makeRoleCheck("Shop"));



route.get("/AllShopApi", async (req, res) => {
  try {
    const shops = await Loginmodel.find({ Role: "Shop" })
      .select("Name Email Role createdAt")
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("AllShopApi error:", error);

    return res.status(500).json({
      success: false,
      msg: "Shop accounts fetch nahi ho sake.",
    });
  }
});

export default route;