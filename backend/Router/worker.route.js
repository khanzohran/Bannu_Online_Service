
import express from "express";
import mongoose from "mongoose";
import Workermodel from "../model/worker.js";
import upload from "../middleware/upload.js";
import cloude from "../middleware/cloude.js";
import authShop from "../middleware/authshop.js";

const route = express.Router();

// =====================================
// CLOUDINARY IMAGE UPLOAD
// =====================================
async function uploadWorkerImage(file) {
  if (!file) {
    throw new Error("Worker ki image select karein.");
  }

  if (!file.buffer) {
    throw new Error(
      "Image buffer nahi mila. upload.js mein memoryStorage check karein."
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloude.uploader.upload_stream(
      {
        folder: "bannu-online-services/workers",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(
            new Error("Cloudinary se image URL nahi mila.")
          );
        }

        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
}

// =====================================
// VALIDATE MONGODB ID
// =====================================
function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =====================================
// CHECK SHOP LOGIN
// authShop middleware must set req.shopOwnerId
// =====================================
function getShopId(req) {
  return req.shopOwnerId || null;
}


async function createWorker(req, res, isElectrician) {
  try {
    const shopId = getShopId(req);

    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Pehle Shop account se login karein.",
      });
    }

    const {
      Name,
      ContactNumber,
      Description,
      BelongsToShop,
      ShopLocation,
    } = req.body;

    // Required fields
    if (
      typeof Name !== "string" ||
      !Name.trim() ||
      typeof ContactNumber !== "string" ||
      !ContactNumber.trim() ||
      typeof ShopLocation !== "string" ||
      !ShopLocation.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Contact Number aur Shop Location required hain.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Worker ki image select karein.",
      });
    }

    // Upload image
    const Image = await uploadWorkerImage(req.file);

    // Create worker under authenticated shop only
    const worker = await Workermodel.create({
      Name: Name.trim(),
      Image,
      ContactNumber: ContactNumber.trim(),
      Description:
        typeof Description === "string"
          ? Description.trim()
          : "",
      // Optional field: frontend se bhejna zaroori nahi
      BelongsToShop:
        typeof BelongsToShop === "string"
          ? BelongsToShop.trim()
          : "",
      ShopLocation: ShopLocation.trim(),

      // Never accept owner ID from frontend
      OurShop: shopId,

      Electrician: isElectrician,
      Plumber: !isElectrician,
    });

    return res.status(201).json({
      success: true,
      message: isElectrician
        ? "Electrician successfully create ho gaya."
        : "Plumber successfully create ho gaya.",
      worker,
    });
  } catch (error) {
    console.error("Worker create error:", error);

    return res.status(500).json({
      success: false,
      message: "Worker create nahi ho saka.",
      error: error.message,
    });
  }
}

// =====================================
// FIND LOGGED-IN SHOP'S WORKERS
// =====================================
async function findMyWorkers(req, res, isElectrician) {
  try {
    const shopId = getShopId(req);

    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Shop login required.",
      });
    }

    const workers = await Workermodel.find({
      OurShop: shopId,
      Electrician: isElectrician,
      Plumber: !isElectrician,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Find workers error:", error);

    return res.status(500).json({
      success: false,
      message: "Workers load nahi ho sake.",
      error: error.message,
    });
  }
}

// =====================================
// FIND ONE WORKER — OWNER ONLY
// =====================================
async function findMyWorker(req, res, isElectrician) {
  try {
    const shopId = getShopId(req);
    const { id } = req.params;

    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Shop login required.",
      });
    }

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID.",
      });
    }

    const worker = await Workermodel.findOne({
      _id: id,
      OurShop: shopId,
      Electrician: isElectrician,
      Plumber: !isElectrician,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker nahi mila ya aapko access nahi hai.",
      });
    }

    return res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error("Find one worker error:", error);

    return res.status(500).json({
      success: false,
      message: "Worker details load nahi ho sakin.",
      error: error.message,
    });
  }
}

// =====================================
// UPDATE OWN WORKER ONLY
// =====================================
async function updateMyWorker(req, res, isElectrician) {
  try {
    const shopId = getShopId(req);
    const { id } = req.params;

    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Shop login required.",
      });
    }

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID.",
      });
    }

    // Owner check happens before updating anything
    const worker = await Workermodel.findOne({
      _id: id,
      OurShop: shopId,
      Electrician: isElectrician,
      Plumber: !isElectrician,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker nahi mila ya aapko access nahi hai.",
      });
    }

    const {
      Name,
      ContactNumber,
      Description,
      BelongsToShop,
      ShopLocation,
    } = req.body;

    if (Name !== undefined) {
      if (typeof Name !== "string" || !Name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name required hai.",
        });
      }

      worker.Name = Name.trim();
    }

    if (ContactNumber !== undefined) {
      if (
        typeof ContactNumber !== "string" ||
        !ContactNumber.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Contact Number required hai.",
        });
      }

      worker.ContactNumber = ContactNumber.trim();
    }

    if (Description !== undefined) {
      worker.Description =
        typeof Description === "string"
          ? Description.trim()
          : "";
    }

    // Optional field
    if (BelongsToShop !== undefined) {
      if (typeof BelongsToShop !== "string") {
        return res.status(400).json({
          success: false,
          message: "BelongsToShop ki value invalid hai.",
        });
      }

      worker.BelongsToShop = BelongsToShop.trim();
    }

    if (ShopLocation !== undefined) {
      if (
        typeof ShopLocation !== "string" ||
        !ShopLocation.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Shop Location required hai.",
        });
      }

      worker.ShopLocation = ShopLocation.trim();
    }

    // Replace image only when a new one is provided
    if (req.file) {
      worker.Image = await uploadWorkerImage(req.file);
    }

    // OurShop cannot be changed through request body
    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker successfully update ho gaya.",
      worker,
    });
  } catch (error) {
    console.error("Worker update error:", error);

    return res.status(500).json({
      success: false,
      message: "Worker update nahi ho saka.",
      error: error.message,
    });
  }
}

// =====================================
// DELETE OWN WORKER ONLY
// =====================================
async function deleteMyWorker(req, res, isElectrician) {
  try {
    const shopId = getShopId(req);
    const { id } = req.params;

    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Shop login required.",
      });
    }

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID.",
      });
    }

    const worker = await Workermodel.findOneAndDelete({
      _id: id,
      OurShop: shopId,
      Electrician: isElectrician,
      Plumber: !isElectrician,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker nahi mila ya aapko access nahi hai.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Worker successfully delete ho gaya.",
    });
  } catch (error) {
    console.error("Worker delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Worker delete nahi ho saka.",
      error: error.message,
    });
  }
}

// =====================================
// ELECTRICIAN ROUTES
// =====================================
route.post(
  "/ElectritionCreateApi",
  authShop,
  upload.single("Image"),
  (req, res) => createWorker(req, res, true)
);

route.get(
  "/MyElectritionFindApi",
  authShop,
  (req, res) => findMyWorkers(req, res, true)
);

route.get(
  "/ElectritionFindOneApi/:id",
  authShop,
  (req, res) => findMyWorker(req, res, true)
);

route.put(
  "/ElectritionUpdateApi/:id",
  authShop,
  upload.single("Image"),
  (req, res) => updateMyWorker(req, res, true)
);

route.delete(
  "/ElectritionDeleteApi/:id",
  authShop,
  (req, res) => deleteMyWorker(req, res, true)
);

// =====================================
// PLUMBER ROUTES
// =====================================
route.post(
  "/PlumberCreateApi",
  authShop,
  upload.single("Image"),
  (req, res) => createWorker(req, res, false)
);

route.get(
  "/MyPlumberFindApi",
  authShop,
  (req, res) => findMyWorkers(req, res, false)
);

route.get(
  "/PlumberFindOneApi/:id",
  authShop,
  (req, res) => findMyWorker(req, res, false)
);

route.put(
  "/PlumberUpdateApi/:id",
  authShop,
  upload.single("Image"),
  (req, res) => updateMyWorker(req, res, false)
);

route.delete(
  "/PlumberDeleteApi/:id",
  authShop,
  (req, res) => deleteMyWorker(req, res, false)
);




route.get("/plumberuserApi", async function (req,res) {
    let Electriuser=await Workermodel.find();

    return res.json({success:true,msg:"The user plumber find api is working",Electriuser:Electriuser});
    
});
route.get("/ElectriuserApi",async function (req,res) {
    let plumber=await Workermodel.find();
    return res.json({success:true,msg:"The electri user find Api is working",plumber:plumber})
})


// =====================================
// PUBLIC ELECTRICIAN API
// Sirf electricians ka data
// =====================================
route.get("/electribookApi", async (req, res) => {
  try {
    const electricians = await Workermodel.find({
      Electrician: true,
      Plumber: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: electricians.length,
      msg: "Electricians successfully load ho gaye.",
      electricians,
    });
  } catch (error) {
    console.error("Electrician Find Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Electricians load nahi ho sake.",
      error: error.message,
    });
  }
});

// =====================================
// PUBLIC USER PLUMBER API
// Sirf plumbers show honge
// =====================================
route.get("/plumberuserApi", async (req, res) => {
  try {
    const plumbers = await Workermodel.find({
      Plumber: true,
      Electrician: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: plumbers.length,
      plumbers,
    });
  } catch (error) {
    console.error("Public plumber find error:", error);

    return res.status(500).json({
      success: false,
      message: "Plumbers load nahi ho sake.",
    });
  }
});
export default route;
