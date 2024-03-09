import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },

  poster: [
    {
      public_id: String,
      url: String,
    },
  ],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  Subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  stock: { type: Number, required: true },
  ratings: { type: Number, required: true, default: 1 },
  NumOfreviews: {
    type: Number,
    required: true,
    default: 1,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  isVariant: {
    type: Boolean,
    default: false,
  },
  ProductVaraint: [{
    size: { type: String },
    quantity: {
      type: Number,
    },
  }],

  additionalInfo: [{
    title: { type: String },
    descriptions:{type:String}
  }],



  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", productSchema);
