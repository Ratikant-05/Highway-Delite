import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected To MongoDB")
  } catch (error) {
    console.log(error.message)
  }
}

export default connectDB