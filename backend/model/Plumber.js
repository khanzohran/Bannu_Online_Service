import mongoose from "mongoose";

let PlumberSchema=mongoose.Schema({

     Name:String,
    usernumber:Number,
    location:String,
    Problem:String,
    Date:String,
    Time:String,
    Description:String,
})
let Plumbermodel=mongoose.model("plumber",PlumberSchema);


export default Plumbermodel;