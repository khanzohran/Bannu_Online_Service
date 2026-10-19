import mongoose from "mongoose";


let sellerSchema=mongoose.Schema({

    Yourname:String,
    Shopname:String,
    phonenumber:Number,
    Cnicnumber:Number,
    shoplocation:String,
    youserimg:String,
   imgurl:String,  

})
let sellermodel=mongoose.model("seller",sellerSchema);



export default sellermodel;