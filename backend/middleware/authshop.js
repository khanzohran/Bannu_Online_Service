
import jwt from "jsonwebtoken";

function authShop(req, res, next) {
  try {
    // Login cookie se token lena
    const token = req.cookies?.["Final-project"];

    // Agar login nahi hai
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Please login to your shop account",
      });
    }

    // JWT token verify karna
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Sirf Shop role ko allow karna
    if (decoded.Role !== "Shop") {
      return res.status(403).json({
        success: false,
        msg: "Access denied. Shop owner only",
      });
    }

    // Shop owner ki verified ID
    req.shopOwnerId = decoded.id;

    // Agli API ko chalne dena
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token. Please login again",
    });
  }
}

export default authShop;
