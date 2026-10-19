

import express from "express";
import mongoose from "mongoose";
import ElecterCreatemodel from "../model/EproductCModel.js";
import authShop from "../middleware/authshop.js";
import upload from "../middleware/upload.js";
import cloudinary from "../middleware/cloude.js";

const route = express.Router();



// ========================================
// CREATE ELECTRICAL PRODUCT + CLOUDINARY IMAGE
// Only logged-in shop owner
// ========================================
route.post(
  "/EPcreateApi",
  authShop,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        ProductName,
        Brand,
        Imageurl,
        price,
        Discount,
        Description,
      } = req.body;

      if (
        !ProductName ||
        price === undefined ||
        price === ""
      ) {
        return res.status(400).json({
          success: false,
          msg: "Product name and price are required",
        });
      }

      let finalImageUrl = Imageurl || "";
      let imagePublicId = "";

      // Upload selected image to Cloudinary
      if (req.file) {
        const base64 = req.file.buffer.toString("base64");

        const imageData =
          `data:${req.file.mimetype};base64,${base64}`;

        const uploadedImage = await cloudinary.uploader.upload(
          imageData,
          {
            folder: "bannu-online-services/electrical-products",
            resource_type: "image",
          }
        );

        finalImageUrl = uploadedImage.secure_url;
        imagePublicId = uploadedImage.public_id;
      }

      const createobj = await ElecterCreatemodel.create({
        ProductName: ProductName.trim(),
        Brand: Brand || "",
        Imageurl: finalImageUrl,
        price: Number(price),
        Discount: Number(Discount || 0),
        Description: Description || "",
        shopOwner: req.shopOwnerId,
      });

      return res.status(201).json({
        success: true,
        msg: "Electrical product created successfully",
        createobj,
        imagePublicId,
      });
    } catch (error) {
      console.error("Electrical Product Create Error:", error);

      return res.status(500).json({
        success: false,
        msg: "Electrical product create failed",
        error: error.message,
      });
    }
  }
);

// ========================================
// PUBLIC PRODUCTS
// ========================================
route.get("/EpfindApi", async (req, res) => {
  try {
    const findobj = await ElecterCreatemodel.find();

    return res.status(200).json({
      success: true,
      msg: "Products found",
      findobj,
    });
  } catch (error) {
    console.error("Find Products Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Find API error",
    });
  }
});

// ========================================
// SECOND PUBLIC PRODUCTS API
// ========================================
route.get("/2ndEpfindApi", async (req, res) => {
  try {
    const findnotwoobj = await ElecterCreatemodel.find();

    return res.status(200).json({
      success: true,
      msg: "Products found",
      findnotwoobj,
    });
  } catch (error) {
    console.error("Second Find Products Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Find API error",
    });
  }
});

// ========================================
// MY SHOP PRODUCTS
// Only logged-in owner's products
// ========================================
route.get("/MyEpfindApi", authShop, async (req, res) => {
  try {
    const findobj = await ElecterCreatemodel.find({
      shopOwner: req.shopOwnerId,
    });

    return res.status(200).json({
      success: true,
      msg: "Your shop products found",
      findobj,
    });
  } catch (error) {
    console.error("My Products Error:", error);

    return res.status(500).json({
      success: false,
      msg: "My products API error",
    });
  }
});

// ========================================
// FIND ONE PRODUCT
// ========================================
route.post("/EpfindoneApi", async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product ID",
      });
    }

    const allfindone = await ElecterCreatemodel.findById(id);

    if (!allfindone) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Product found",
      allfindone,
    });
  } catch (error) {
    console.error("Find One Product Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Findone API error",
    });
  }
});

// ========================================
// UPDATE PRODUCT
// Only its owner can update
// ========================================
route.post(
  "/EPupdateApi",
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

      delete updateData.shopOwner;
      delete updateData._id;
      delete updateData.__v;

      const product = await ElecterCreatemodel.findOne({
        _id: id,
        shopOwner: req.shopOwnerId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: "Product not found in your shop",
        });
      }

      // Upload replacement image only if a new one is selected
      if (req.file) {
        const base64 = req.file.buffer.toString("base64");

        const imageData =
          `data:${req.file.mimetype};base64,${base64}`;

        const uploadedImage = await cloudinary.uploader.upload(
          imageData,
          {
            folder: "bannu-online-services/electrical-products",
            resource_type: "image",
          }
        );

        // Delete previous Cloudinary image if its public ID is known
        if (product.ImagePublicId) {
          try {
            await cloudinary.uploader.destroy(
              product.ImagePublicId
            );
          } catch (deleteError) {
            console.error(
              "Old image cleanup error:",
              deleteError.message
            );
          }
        }

        updateData.Imageurl = uploadedImage.secure_url;

        // Optional schema field; add ImagePublicId to schema
        // if you want to save this value in MongoDB.
        if (
          product.schema.path("ImagePublicId")
        ) {
          updateData.ImagePublicId = uploadedImage.public_id;
        }
      }

      if (updateData.price !== undefined) {
        updateData.price = Number(updateData.price);
      }

      if (updateData.Discount !== undefined) {
        updateData.Discount = Number(updateData.Discount);
      }

      const updatedProduct =
        await ElecterCreatemodel.findOneAndUpdate(
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

      return res.status(200).json({
        success: true,
        msg: "Product updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("Product Update Error:", error);

      return res.status(500).json({
        success: false,
        msg: "Product update failed",
        error: error.message,
      });
    }
  }
);

// ========================================
// DELETE PRODUCT
// Only its owner can delete
// ========================================
route.post("/EPdeleteApi", authShop, async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product ID",
      });
    }

    const deletedProduct =
      await ElecterCreatemodel.findOneAndDelete({
        _id: id,
        shopOwner: req.shopOwnerId,
      });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in your shop",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Product Delete Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Product delete failed",
    });
  }
});

export default route;
