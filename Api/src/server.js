import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import userRoute from "./route/userRoute";
import postRoute from "./route/postRoute";
import likeRoute from "./route/likeRoute";
import storeRoute from "./route/storeRoute";
import commentRoute from "./route/commentRoute";
import followerRoute from "./route/followerRoute";
import messageRoute from "./route/messageRoute";
import connectDB from "./config/connectDB";
import cors from 'cors';

require('dotenv').config();

let app = express();
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);

//Route
userRoute(app);
postRoute(app);
likeRoute(app);
commentRoute(app);
followerRoute(app);
messageRoute(app);
storeRoute(app);

connectDB();

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Backend is running on the port : " + port);
});