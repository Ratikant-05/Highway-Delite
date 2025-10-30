import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title:{
    type:String,
    trim:true,
    required:true
  },
  image:{
    type:String,
    required:false,
    default:""
  },
  location:{
    type:String,
    trim:true,
    required:true
  },
  content:{
    type:String,
    trim:true,
    required:true
  },
  timeSlots: {
    type: [String],
    default: []
  },
  price:{
    type:Number,
    trim:true,
    required:true
  },
  about:{
    type:String,
    trim:true,
    required:true
  }
},{timestamps:true})

export default mongoose.model("Experience", experienceSchema)