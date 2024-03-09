import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minLength: [6, "password must be atkeast 6 character"],
    select: false,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  otp: { type: String },
  otpExpiration: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
