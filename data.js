import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("mongodb is connected");
    }).catch((e) => {
        console.log(e);
    })
}