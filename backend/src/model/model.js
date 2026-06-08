import mongoose from "mongoose";


const userSchem= new mongoose.Schema({
  username : String,
  email : String,
  place : String,
  password: String,
  role: { type: String, default: "user" }
})

const productSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  weight: String,
  price: String,
  image: String,
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [productSchema],  // Array of products
});

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categories: [categorySchema], // Array of categories
});

export const products=mongoose.model("Products", productsSchema);

export const usern= mongoose.model("User",userSchem);

const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  weight: String,
  price: String,
  image: String,
  count: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  items: [orderItemSchema],
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);