
import Loginmodel from "../model/Login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

const route = express.Router();

const ALLOWED_ROLES = ["admin", "User", "Shop"];
const COOKIE_NAME = "Final-project";

// ================= COOKIE OPTIONS =================

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ================= JWT TOKEN =================

function makeToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in backend .env");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      Role: user.Role,
    },
    secret,
    { expiresIn: "7d" }
  );
}

// ================= AUTHENTICATION HELPER =================

function authenticate(req, res, requiredRole = null) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({
      success: false,
      msg: "Please login again.",
    });

    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is missing in backend environment.");

    res.status(500).json({
      success: false,
      msg: "Server authentication configuration error.",
    });

    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (requiredRole && decoded.Role !== requiredRole) {
      res.status(403).json({
        success: false,
        msg: `Only ${requiredRole} can perform this action.`,
      });

      return null;
    }

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    res.status(401).json({
      success: false,
      msg: "Invalid or expired session. Please login again.",
    });

    return null;
  }
}

// ================= SIGNUP =================

route.post("/SignApi", async (req, res) => {
  try {
    const { Name, Email, password, Role, AccessCode } = req.body;

    if (
      !Name?.trim() ||
      !Email?.trim() ||
      !password ||
      !Role
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required.",
      });
    }

    if (!ALLOWED_ROLES.includes(Role)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid role.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        msg: "Server authentication configuration error.",
      });
    }

    const normalizedEmail = Email.trim().toLowerCase();

    const existingEmail = await Loginmodel.findOne({
      Email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        msg: "An account with this email already exists.",
      });
    }

    // Only one admin account is allowed.
    // Note: this check alone does not make public admin signup secure.
    if (Role === "admin") {
      const existingAdmin = await Loginmodel.exists({
        Role: "admin",
      });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          msg: "An admin account already exists.",
        });
      }
    }

    let shopCodeHash = null;

    if (Role === "Shop") {
      if (!AccessCode || AccessCode.length < 6) {
        return res.status(400).json({
          success: false,
          msg: "Shop code must contain at least 6 characters.",
        });
      }

      shopCodeHash = await bcrypt.hash(AccessCode, 10);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const storedData = await Loginmodel.create({
      Name: Name.trim(),
      Email: normalizedEmail,
      password: hashedPassword,
      Role,
      ShopCode: shopCodeHash,
    });

    const token = makeToken(storedData);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.status(201).json({
      success: true,
      msg: "Account created successfully.",
      data: {
        _id: storedData._id,
        Name: storedData.Name,
        Email: storedData.Email,
        Role: storedData.Role,
      },
    });
  } catch (error) {
    console.error("SignApi error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        msg: "This email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      msg: "Unable to create account.",
    });
  }
});

// ================= LOGIN =================

route.post("/loginApi", async (req, res) => {
  try {
    const { Email, password, Role, AccessCode } = req.body;

    if (!Email || !password || !Role) {
      return res.status(400).json({
        success: false,
        msg: "Email, password and role are required.",
      });
    }

    if (!ALLOWED_ROLES.includes(Role)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid role.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        msg: "Server authentication configuration error.",
      });
    }

    const normalizedEmail = Email.trim().toLowerCase();

    const existingData = await Loginmodel.findOne({
      Email: normalizedEmail,
      Role,
    });

    if (!existingData) {
      return res.status(401).json({
        success: false,
        msg: "Email, password or role is incorrect.",
      });
    }

    const passwordOk = await bcrypt.compare(
      password,
      existingData.password
    );

    if (!passwordOk) {
      return res.status(401).json({
        success: false,
        msg: "Email, password or role is incorrect.",
      });
    }

    if (existingData.Role === "Shop") {
      if (!AccessCode) {
        return res.status(400).json({
          success: false,
          msg: "Shop access code is required.",
        });
      }

      const codeOk = existingData.ShopCode
        ? await bcrypt.compare(AccessCode, existingData.ShopCode)
        : false;

      if (!codeOk) {
        return res.status(401).json({
          success: false,
          msg: "Shop access code is incorrect.",
        });
      }
    }

    const token = makeToken(existingData);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.status(200).json({
      success: true,
      msg: "Login successful.",
      Role: existingData.Role,
    });
  } catch (error) {
    console.error("loginApi error:", error.message);

    return res.status(500).json({
      success: false,
      msg: "Unable to login.",
    });
  }
});

// ================= LOGOUT =================

route.post("/logoutApi", (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;

  res.clearCookie(COOKIE_NAME, clearOptions);

  return res.status(200).json({
    success: true,
    msg: "Logged out successfully.",
  });
});

// ================= CHECK IF ADMIN EXISTS =================

route.get("/AdminExists", async (req, res) => {
  try {
    const adminExists = Boolean(
      await Loginmodel.exists({ Role: "admin" })
    );

    return res.status(200).json({ adminExists });
  } catch (error) {
    console.error("AdminExists error:", error.message);

    return res.status(500).json({
      success: false,
      msg: "Unable to check admin account.",
    });
  }
});

// ================= ROLE CHECKS =================

function makeRoleCheck(requiredRole) {
  return (req, res) => {
    const decoded = authenticate(req, res, requiredRole);

    if (!decoded) return;

    return res.status(200).json({
      success: true,
      msg: "User authenticated successfully.",
    });
  };
}

route.get("/adminCheck", makeRoleCheck("admin"));
route.get("/userCheck", makeRoleCheck("User"));
route.get("/shopCheck", makeRoleCheck("Shop"));

// ================= GET ALL SHOPS =================

route.get("/AllShopApi", async (req, res) => {
  try {
    const shops = await Loginmodel.find({
      Role: "Shop",
    })
      .select("Name Email Role createdAt")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("AllShopApi error:", error.message);

    return res.status(500).json({
      success: false,
      msg: "Unable to fetch shop accounts.",
    });
  }
});

// ================= GET ALL CUSTOMERS =================

route.get("/AllCustomers", async (req, res) => {
  const admin = authenticate(req, res, "admin");

  if (!admin) return;

  try {
    const customers = await Loginmodel.find({
      Role: "User",
    })
      .select("Name Email Role")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("AllCustomers database error:", error.message);

    return res.status(500).json({
      success: false,
      msg: "Unable to fetch customers.",
    });
  }
});

// ================= DELETE CUSTOMER =================

route.delete("/DeleteCustomer/:id", async (req, res) => {
  const admin = authenticate(req, res, "admin");

  if (!admin) return;

  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid customer ID.",
      });
    }

    const customer = await Loginmodel.findOneAndDelete({
      _id: id,
      Role: "User",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error("DeleteCustomer database error:", error.message);

    return res.status(500).json({
      success: false,
      msg: "Unable to delete customer.",
    });
  }
});

export default route;
