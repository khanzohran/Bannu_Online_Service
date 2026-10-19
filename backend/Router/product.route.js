import express from "express";
import productcreatemodel from "../model/product.js";

let route = express.Router();

route.post("/productcreate",  async function (req, res) {
  try {
    const data = req.body;

    const product = await productcreatemodel.create(data);


    
    return res.json({
      success: true,
      msg: "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Product create failed",
      error: error.message,
    });
  }
});


route.get("/allproducts", async function (req, res) {
  try {
    const mydata = await productcreatemodel.find();

    return res.json({
      success: true,
      msg: "The find API is working",
      getallproducts: mydata,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Products find failed",
      error: error.message,
    });
  }
});


route.post("/findoneapi", async function (req,res) {

  let findoneobj=req.body
  let productData=await  productcreatemodel.findOne({_id:findoneobj.id})
  console.log(findoneobj.id)
  return res.json({success:true,msg:"the api working",product:productData})
})






route.post("/productupdateapi" , async function (req,res) {

   

  await productcreatemodel.findOneAndUpdate({_id:req.body.id},{...req.body})

  return res.json({success:true,msg:"the updata api is working",})
  
})

 route.post("/productDeletapi" ,async function (req,res) {
  let Deletobj= req.body
   await productcreatemodel.findOneAndDelete({_id:Deletobj.id},{...Deletobj})

   return res.json({success:true,msg:"the Delete api is working"})
  
 })

export default route;