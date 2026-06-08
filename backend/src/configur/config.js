import mongoose from "mongoose";

export async function connectDB(url){
   const dbName = process.env.DB_NAME;
   await mongoose.connect(url, { dbName });
}