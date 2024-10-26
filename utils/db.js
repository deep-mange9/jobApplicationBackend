import mongoose from "mongoose";

const connectDB = async() =>{
    try{
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("database connected successfully");
    }
    catch(err){
        console.log(`error in connecting database , error : ${err}`);
    }
}

export default connectDB;