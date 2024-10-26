import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
const app = express();
dotenv.config({});
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
   origin : "https//localhost:5173",
   credentials : true, 
}
app.use(cors(corsOptions));



app.use("/api/v1/user" , userRouter);
app.use("/api/v2/company" , companyRouter);
app.use("/api/v3/job" , jobRouter);
app.use("/api/v4/application" , applicationRouter);



const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    connectDB();
    console.log(`the server is running on port ${port}`);
})