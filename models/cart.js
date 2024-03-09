import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
export const Cart = mongoose.model("Cart", cartSchema);
