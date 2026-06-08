import { Router } from "express";
import {
  register,
  login,
  addproducts,
  getProducts,
  getProductsByCategory,
  addProductToCategory,
  removeProductFromCategory,
  placeOrder,
  getAdminDashboard,
} from "../controlls/controll.js";


const route=Router()

route.get("/getProducts",getProducts)

route.post("/login",login)
route.post("/register",register)
route.post("/addproducts",addproducts)
route.post("/getProductsByCategory",getProductsByCategory)
route.post("/orders", placeOrder)
route.get("/admin/dashboard", getAdminDashboard)
route.post("/admin/products/add", addProductToCategory)
route.post("/admin/products/remove", removeProductFromCategory)



export default route;