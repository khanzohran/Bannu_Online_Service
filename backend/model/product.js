import mongoose from "mongoose";

let productcreatedata=mongoose.Schema({
 title:String,
 description:String,
 Imageurl:String,
price:Number,
qualilty:String,
stock:Number,
size:String,
color:String,
catagory:String,
 discount:Number,
})
let productcreatemodel=mongoose.model("product",productcreatedata)
export default productcreatemodel