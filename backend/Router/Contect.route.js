
import express from "express";
import contactmodel from "../model/contact.js";

let route = express.Router();

route.post("/contactcreate", async function (req, res) {
  try {
    const data = req.body;

    const contact = await contactmodel.create(data);

    return res.json({
      success: true,
      msg: "Contact created successfully",
      contact: contact,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Contact create failed",
      error: error.message,
    });
  }
});

// FIND ALL CONTACTS API
route.get("/allcontacts", async function (req, res) {
  try {
    const mydata = await contactmodel.find().sort({ _id: -1 });

    return res.json({
      success: true,
      msg: "The contact find API is working",
      getallcontacts: mydata,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Contacts find failed",
      error: error.message,
    });
  }
});

// FIND ONE CONTACT API
route.post("/findonecontactapi", async function (req, res) {
  try {
    const findoneobj = req.body;

    const contactData = await contactmodel.findOne({
      _id: findoneobj.id,
    });

    if (!contactData) {
      return res.status(404).json({
        success: false,
        msg: "Contact not found",
      });
    }

    return res.json({
      success: true,
      msg: "The find one contact API is working",
      contact: contactData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Contact find failed",
      error: error.message,
    });
  }
});



// DELETE CONTACT API
route.post("/contactdeleteapi", async function (req, res) {
  try {
    const deleteObj = req.body;

    const deletedContact = await contactmodel.findOneAndDelete({
      _id: deleteObj.id,
    });

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        msg: "Contact not found",
      });
    }

    return res.json({
      success: true,
      msg: "Contact deleted successfully",
      contact: deletedContact,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Contact delete failed",
      error: error.message,
    });
  }
});

export default route;
