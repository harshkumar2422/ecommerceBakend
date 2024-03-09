// import mongoose from "mongoose";

// const productVariantSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.ObjectId,
//         ref: "Product",
// },
//     sizes: [{
//         size: {
//             type: String,
//         },
//         quantity: {
//             type: Number,
//             default: 0,
//     }
//   }],
//   colors: [{
//     color: {
//         type: String,
//     },
//     quantity: {
//         type: Number,
//         default: 0,
// }
// }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const ProductVariant = mongoose.model(
//   "ProductVariant",
//   productVariantSchema
// );
import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Size = mongoose.model("Size", sizeSchema);


