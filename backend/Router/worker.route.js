
import express from "express";
import jwt from "jsonwebtoken";
import Workermodel from "../model/worker.js";
import upload from "../middleware/upload.js";
import cloude from "../middleware/cloude.js";

const route = express.Router();

/* =========================
   AUTHENTICATION MIDDLEWARE
========================= */

function getToken(req) {
  return req.cookies?.["Final-project"];
}

function authShop(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.Role !== "Shop") {
      return res.status(403).json({
        success: false,
        message: "Only shop owners can access this API.",
      });
    }

    req.shopOwnerId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }
}

function authAdmin(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.Role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this API.",
      });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }
}

/* =========================
   CLOUDINARY IMAGE UPLOAD
========================= */

async function uploadWorkerImage(file) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloude.uploader.upload_stream(
      {
        folder: "bannu-online-services/workers",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
}

function parseBoolean(value) {
  return value === true || value === "true";
}

function getWorkerType(req) {
  const electrician = parseBoolean(req.body.Electrician);
  const plumber = parseBoolean(req.body.Plumber);

  return {
    Electrician: electrician,
    Plumber: plumber,
  };
}

/* =========================
   SHOP OWNER: CREATE ELECTRICIAN
   POST /ElectritionCreateApi
========================= */

route.post(
  "/ElectritionCreateApi",
  authShop,
  upload.single("Image"),
  async (req, res) => {
    try {
      const { Name, ContactNumber, Description, ShopLocation, BelongsToShop } =
        req.body;

      if (!Name || !ContactNumber) {
        return res.status(400).json({
          success: false,
          message: "Name and contact number are required.",
        });
      }

      const Image = await uploadWorkerImage(req.file);

      const worker = await Workermodel.create({
        Name,
        ContactNumber,
        Description: Description || "",
        Image: Image || "",
        ShopLocation: ShopLocation || "",
        BelongsToShop: BelongsToShop || "",
        OurShop: req.shopOwnerId,
        Electrician: true,
        Plumber: false,
      });

      return res.status(201).json({
        success: true,
        message: "Electrician created successfully.",
        worker,
      });
    } catch (error) {
      console.error("Create electrician error:", error);

      return res.status(500).json({
        success: false,
        message: "Electrician create nahi ho saka.",
        error: error.message,
      });
    }
  }
);

/* =========================
   SHOP OWNER: CREATE PLUMBER
   POST /PlumberCreateApi
========================= */

route.post(
  "/PlumberCreateApi",
  authShop,
  upload.single("Image"),
  async (req, res) => {
    try {
      const { Name, ContactNumber, Description, ShopLocation, BelongsToShop } =
        req.body;

      if (!Name || !ContactNumber) {
        return res.status(400).json({
          success: false,
          message: "Name and contact number are required.",
        });
      }

      const Image = await uploadWorkerImage(req.file);

      const worker = await Workermodel.create({
        Name,
        ContactNumber,
        Description: Description || "",
        Image: Image || "",
        ShopLocation: ShopLocation || "",
        BelongsToShop: BelongsToShop || "",
        OurShop: req.shopOwnerId,
        Electrician: false,
        Plumber: true,
      });

      return res.status(201).json({
        success: true,
        message: "Plumber created successfully.",
        worker,
      });
    } catch (error) {
      console.error("Create plumber error:", error);

      return res.status(500).json({
        success: false,
        message: "Plumber create nahi ho saka.",
        error: error.message,
      });
    }
  }
);

/* =========================
   SHOP OWNER: FIND MY ELECTRICIANS
   GET /MyElectritionFindApi
========================= */

route.get("/MyElectritionFindApi", authShop, async (req, res) => {
  try {
    const workers = await Workermodel.find({
      OurShop: req.shopOwnerId,
      Electrician: true,
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("My electricians error:", error);

    return res.status(500).json({
      success: false,
      message: "Electricians load nahi ho sake.",
      error: error.message,
    });
  }
});

/* =========================
   SHOP OWNER: FIND MY PLUMBERS
   GET /MyPlumberFindApi
========================= */

route.get("/MyPlumberFindApi", authShop, async (req, res) => {
  try {
    const workers = await Workermodel.find({
      OurShop: req.shopOwnerId,
      Plumber: true,
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("My plumbers error:", error);

    return res.status(500).json({
      success: false,
      message: "Plumbers load nahi ho sake.",
      error: error.message,
    });
  }
});

/* =========================
   ADMIN: FIND ALL WORKERS
   GET /AllWorkersFindApi

   All shops ke electricians aur plumbers.
========================= */

route.get("/AllWorkersFindApi", authAdmin, async (req, res) => {
  try {
    const workers = await Workermodel.find({
      $or: [{ Electrician: true }, { Plumber: true }],
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("All workers error:", error);

    return res.status(500).json({
      success: false,
      message: "All workers load nahi ho sake.",
      error: error.message,
    });
  }
});

/* =========================
   SHOP OWNER: FIND ONE ELECTRICIAN
   GET /ElectritionFindOneApi/:id
========================= */

route.get("/ElectritionFindOneApi/:id", authShop, async (req, res) => {
  try {
    const worker = await Workermodel.findOne({
      _id: req.params.id,
      OurShop: req.shopOwnerId,
      Electrician: true,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Electrician nahi mila.",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Electrician load nahi ho saka.",
      error: error.message,
    });
  }
});

/* =========================
   SHOP OWNER: FIND ONE PLUMBER
   GET /PlumberFindOneApi/:id
========================= */

route.get("/PlumberFindOneApi/:id", authShop, async (req, res) => {
  try {
    const worker = await Workermodel.findOne({
      _id: req.params.id,
      OurShop: req.shopOwnerId,
      Plumber: true,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Plumber nahi mila.",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Plumber load nahi ho saka.",
      error: error.message,
    });
  }
});

/* =========================
   SHOP OWNER: UPDATE ELECTRICIAN
   PUT /ElectritionUpdateApi/:id
========================= */

route.put(
  "/ElectritionUpdateApi/:id",
  authShop,
  upload.single("Image"),
  async (req, res) => {
    try {
      const worker = await Workermodel.findOne({
        _id: req.params.id,
        OurShop: req.shopOwnerId,
        Electrician: true,
      });

      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Electrician nahi mila ya aapka worker nahi hai.",
        });
      }

      const { Name, ContactNumber, Description, ShopLocation, BelongsToShop } =
        req.body;

      if (Name !== undefined) worker.Name = Name;
      if (ContactNumber !== undefined) {
        worker.ContactNumber = ContactNumber;
      }
      if (Description !== undefined) worker.Description = Description;
      if (ShopLocation !== undefined) worker.ShopLocation = ShopLocation;
      if (BelongsToShop !== undefined) {
        worker.BelongsToShop = BelongsToShop;
      }

      if (req.file) {
        worker.Image = await uploadWorkerImage(req.file);
      }

      await worker.save();

      return res.status(200).json({
        success: true,
        message: "Electrician updated successfully.",
        worker,
      });
    } catch (error) {
      console.error("Update electrician error:", error);

      return res.status(500).json({
        success: false,
        message: "Electrician update nahi ho saka.",
        error: error.message,
      });
    }
  }
);

/* =========================
   SHOP OWNER: UPDATE PLUMBER
   PUT /PlumberUpdateApi/:id
========================= */

route.put(
  "/PlumberUpdateApi/:id",
  authShop,
  upload.single("Image"),
  async (req, res) => {
    try {
      const worker = await Workermodel.findOne({
        _id: req.params.id,
        OurShop: req.shopOwnerId,
        Plumber: true,
      });

      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Plumber nahi mila ya aapka worker nahi hai.",
        });
      }

      const { Name, ContactNumber, Description, ShopLocation, BelongsToShop } =
        req.body;

      if (Name !== undefined) worker.Name = Name;
      if (ContactNumber !== undefined) {
        worker.ContactNumber = ContactNumber;
      }
      if (Description !== undefined) worker.Description = Description;
      if (ShopLocation !== undefined) worker.ShopLocation = ShopLocation;
      if (BelongsToShop !== undefined) {
        worker.BelongsToShop = BelongsToShop;
      }

      if (req.file) {
        worker.Image = await uploadWorkerImage(req.file);
      }

      await worker.save();

      return res.status(200).json({
        success: true,
        message: "Plumber updated successfully.",
        worker,
      });
    } catch (error) {
      console.error("Update plumber error:", error);

      return res.status(500).json({
        success: false,
        message: "Plumber update nahi ho saka.",
        error: error.message,
      });
    }
  }
);

/* =========================
   SHOP OWNER: DELETE ELECTRICIAN
   DELETE /ElectritionDeleteApi/:id
========================= */

route.delete("/ElectritionDeleteApi/:id", authShop, async (req, res) => {
  try {
    const worker = await Workermodel.findOneAndDelete({
      _id: req.params.id,
      OurShop: req.shopOwnerId,
      Electrician: true,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Electrician nahi mila ya aapka worker nahi hai.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Electrician deleted successfully.",
      worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Electrician delete nahi ho saka.",
      error: error.message,
    });
  }
});

/* =========================
   SHOP OWNER: DELETE PLUMBER
   DELETE /PlumberDeleteApi/:id
========================= */

route.delete("/PlumberDeleteApi/:id", authShop, async (req, res) => {
  try {
    const worker = await Workermodel.findOneAndDelete({
      _id: req.params.id,
      OurShop: req.shopOwnerId,
      Plumber: true,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Plumber nahi mila ya aapka worker nahi hai.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plumber deleted successfully.",
      worker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Plumber delete nahi ho saka.",
      error: error.message,
    });
  }
});

/* =========================
   PUBLIC: ELECTRICIANS
   GET /ElectriuserApi
========================= */

route.get("/ElectriuserApi", async (req, res) => {
  try {
    const electricians = await Workermodel.find({
      Electrician: true,
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: electricians.length,
      electricians,
      Electriuser: electricians,
      workers: electricians,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Electricians load nahi ho sake.",
      error: error.message,
    });
  }
});

/* =========================
   PUBLIC: PLUMBERS
   GET /plumberuserApi
========================= */

route.get("/plumberuserApi", async (req, res) => {
  try {
    const plumbers = await Workermodel.find({
      Plumber: true,
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: plumbers.length,
      plumbers,
      workers: plumbers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Plumbers load nahi ho sake.",
      error: error.message,
    });
  }
});

/* =========================
   PUBLIC: ELECTRICIAN BOOKING LIST
   GET /electribookApi
========================= */

route.get("/electribookApi", async (req, res) => {
  try {
    const electricians = await Workermodel.find({
      Electrician: true,
    }).sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      count: electricians.length,
      electricians,
      workers: electricians,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Electricians load nahi ho sake.",
      error: error.message,
    });
  }
});

export default route;
