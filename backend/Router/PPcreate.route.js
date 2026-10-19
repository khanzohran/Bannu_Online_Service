
import express from "express";
import mongoose from "mongoose";
import plumbercreatemodel from "../model/PproductC.js";
import authShop from "../middleware/authshop.js";
import upload from "../middleware/upload.js";
import cloudinary from "../middleware/cloude.js";

const route = express.Router();

// ========================================
// CLOUDINARY IMAGE UPLOAD HELPER
// ========================================
async function uploadImage(file) {
  if (!file) return null;

  const base64Image = file.buffer.toString("base64");
  const imageData = `data:${file.mimetype};base64,${base64Image}`;

  const result = await cloudinary.uploader.upload(imageData, {
    folder: "bannu-online-services/plumbing-products",
    resource_type: "image",
  });

  return result.secure_url;
}

// ========================================
// CREATE PLUMBING PRODUCT
// Image field: image
// ========================================
route.post(
  "/PPcreateApi",
  authShop,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        ProductName,
        Brand,
        price,
        stock,
        size,
        color,
        Discount,
        Description,
        Location,
      } = req.body;

      if (
        !ProductName?.trim() ||
        price === undefined ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          success: false,
          msg: "Product name and valid price are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          msg: "Please select a product image",
        });
      }

      const imageUrl = await uploadImage(req.file);

      const ppcreateobj = await plumbercreatemodel.create({
        ProductName: ProductName.trim(),
        Brand,
        Imageurl: imageUrl,
        price: Number(price),
        stock: Number(stock || 0),
        size,
        color,
        Discount: Number(Discount || 0),
        Description,
        Location,
        shopOwner: req.shopOwnerId,
      });

      return res.status(201).json({
        success: true,
        msg: "Plumbing product created successfully",
        ppcreateobj,
      });
    } catch (error) {
      console.error("Plumbing Product Create Error:", error);

      return res.status(500).json({
        success: false,
        msg: "Create API error",
      });
    }
  }
);

// ========================================
// PUBLIC PRODUCTS
// ========================================
route.get("/PPfindApi", async (req, res) => {
  try {
    const findobj = await plumbercreatemodel.find();

    return res.json({
      success: true,
      msg: "Products found",
      findobj,
    });
  } catch (error) {
    console.error("Plumbing Find Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Find API error",
    });
  }
});

route.get("/2ndPPfindApi", async (req, res) => {
  try {
    const findnotwo = await plumbercreatemodel.find();

    return res.json({
      success: true,
      msg: "Products found",
      findnotwo,
    });
  } catch (error) {
    console.error("Second Plumbing Find Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Find API error",
    });
  }
});

// ========================================
// MY SHOP PRODUCTS
// ========================================
route.get("/MyPpfindApi", authShop, async (req, res) => {
  try {
    const findobj = await plumbercreatemodel.find({
      shopOwner: req.shopOwnerId,
    });

    return res.json({
      success: true,
      msg: "Your shop plumbing products found",
      findobj,
    });
  } catch (error) {
    console.error("My Plumbing Products Error:", error);

    return res.status(500).json({
      success: false,
      msg: "My products API error",
    });
  }
});

// ========================================
// FIND ONE PRODUCT
// ========================================
route.post("/PPfindoneApi", async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product ID",
      });
    }

    const Allfindoneobj = await plumbercreatemodel.findById(id);

    if (!Allfindoneobj) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    return res.json({
      success: true,
      msg: "Product found",
      Allfindoneobj,
    });
  } catch (error) {
    console.error("Plumbing Find One Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Findone API error",
    });
  }
});

// ========================================
// UPDATE PLUMBING PRODUCT
// Optional new image upload
// ========================================
route.post(
  "/PPupdateApi",
  authShop,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id, ...updateData } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          msg: "Invalid product ID",
        });
      }

      // Prevent changing product ownership or ID
      delete updateData.shopOwner;
      delete updateData._id;
      delete updateData.__v;

      if (updateData.price !== undefined) {
        updateData.price = Number(updateData.price);
      }

      if (updateData.stock !== undefined) {
        updateData.stock = Number(updateData.stock);
      }

      if (updateData.Discount !== undefined) {
        updateData.Discount = Number(updateData.Discount);
      }

      // Only replace image when a new image is uploaded
      if (req.file) {
        updateData.Imageurl = await uploadImage(req.file);
      }

      const updatedProduct =
        await plumbercreatemodel.findOneAndUpdate(
          {
            _id: id,
            shopOwner: req.shopOwnerId,
          },
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          msg: "Product not found in your shop",
        });
      }

      return res.json({
        success: true,
        msg: "Product updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("Plumbing Product Update Error:", error);

      return res.status(500).json({
        success: false,
        msg: "Update API error",
      });
    }
  }
);

// ========================================
// DELETE PLUMBING PRODUCT
// ========================================
route.post("/PPdelateApi", authShop, async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product ID",
      });
    }

    const deletedProduct =
      await plumbercreatemodel.findOneAndDelete({
        _id: id,
        shopOwner: req.shopOwnerId,
      });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in your shop",
      });
    }

    return res.json({
      success: true,
      msg: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Plumbing Product Delete Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Delete API error",
    });
  }
});

export default route;
