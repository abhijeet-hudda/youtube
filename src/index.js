// // database se jab bhi baat kro to do kam kro
// //1. try catch (error handle krne k liye)
// //2. async await (asynchronous kam krne k liye)(time lagta h database se baat krne me to async await use krte h)

import dotenv from "dotenv";
import connectDB from "./db/db_connect.js";
dotenv.config({
    path: "./env"
})

connectDB();














/*

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

import express from "express";
const app =express();

//this is IIFE;()()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("errror",(error)=>{
            console.log("Error",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listing at port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error:", error);
        throw error
    }
})()


*/







// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";

// const app = express();

// (async () => {
//   try {
//     console.log("Mongo URI:", process.env.MONGODB_URI);

//     await mongoose.connect(
//       `${process.env.MONGODB_URI}/${DB_NAME}`
//     );

//     app.listen(process.env.PORT, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT}`);
//     });

//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//   }
// })();
