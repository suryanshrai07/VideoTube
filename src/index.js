import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path : "./.env"
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error :",error);
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`App is listing at PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection is failed :",err)
})










/* import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR :", error);
      throw error;
    });

    app.listen(process.env.PORT,()=>{
        console.log(`app is listing on ${process.env.PORT}`);
    })
  } catch (error) {
    console.error("ERROR :", error);
    throw error;
  }
})();
*/


