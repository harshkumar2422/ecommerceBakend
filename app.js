import express from "express";
import { config } from "dotenv";
import { connectDB } from "./data.js";
import ErrorMiddleware from "./middleware/Error.js";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/ProductRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
//usinf dotnev
config({ path: "./config.env" });

//database connected
connectDB();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extends: false }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(express.json());
app.use(cookieParser());
export default app;

app.get("/", (req, res) => {
    res.send("hello")
})

//api
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);

//errorMiddeleware
app.use(ErrorMiddleware);
