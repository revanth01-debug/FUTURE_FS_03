import jwt from "jsonwebtoken";
import {products,usern, Order} from "../model/model.js"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => email.trim().toLowerCase();

const findUserByEmail = (normalizedEmail) =>
  usern.findOne({
    email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  });

const passwordsMatch = (storedPassword, inputPassword) => {
  if (storedPassword == null || inputPassword == null) return false;
  return String(storedPassword).trim() === String(inputPassword).trim();
};

const findUserForLogin = async (emailOrUsername) => {
  const normalizedEmail = normalizeEmail(emailOrUsername);
  const byEmail = await findUserByEmail(normalizedEmail);
  if (byEmail) return byEmail;

  const trimmed = emailOrUsername.trim();
  return usern.findOne({
    $or: [{ username: trimmed }, { email: trimmed }],
  });
};

export async function login(req, res) {
  const { email, username, password } = req.body;
  const loginId = (email || username || "").trim();

  if (!loginId || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await findUserForLogin(loginId);

  if (!user) {
    return res.status(404).json({ message: "Email didn't register" });
  }

  if (!passwordsMatch(user.password, password)) {
    return res.status(401).json({ message: "Password is wrong" });
  }

  const role = user.role || "user";
  const payload = {
    email: user.email,
    username: user.username,
    role,
  };
  const token = jwt.sign(payload, "ABC");
  return res.status(200).json({ token, role });
}

export async function register(req, res) {
  const { username, email, place, password } = req.body;

  if (!username || !email || !place || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  const existingUser =
    (await usern.findOne({ username })) || (await findUserByEmail(normalizedEmail));

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(400).json({ message: "Username already taken" });
  }

  const role = "user";
  const newuser = new usern({ username, email: normalizedEmail, place, password, role });
  await newuser.save();

  const payload = { username, email: normalizedEmail, role };
  const token = jwt.sign(payload, "ABC");
  return res.status(200).json({ token, role });
}

export async function getProducts(req,res) {
  try {
    const data = await products.find().lean();
    const categories = data.flatMap((doc) => doc.categories || []);

    res.status(200).json({
      totalDocuments: data.length,
      categories,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function addproducts(req,res) {
    try {
    const newProducts = new products(req.body);
    await newProducts.save();
    res.status(201).json({ message: "Products added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




export async function getProductsByCategory(req, res) {

  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const Products = await products.aggregate([
      { $unwind: "$categories" }, 
      { $match: { "categories.name": category } }, 
      { $project: { _id: 0, products: "$categories.products" } } 
    ]);

    if (!Products.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(Products[0].products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addProductToCategory(req, res) {
  try {
    const { categoryName, name, weight, price, image } = req.body;

    if (!categoryName || !name || !price) {
      return res.status(400).json({ message: "categoryName, name and price are required" });
    }

    let productsDoc = await products.findOne();
    if (!productsDoc) {
      productsDoc = await products.create({ title: "E-Commerce", categories: [] });
    }

    const maxId = productsDoc.categories
      .flatMap((category) => category.products || [])
      .reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);

    const newProduct = {
      id: maxId + 1,
      name,
      weight: weight || "",
      price,
      image: image || "",
    };

    const category = productsDoc.categories.find((item) => item.name === categoryName);
    if (category) {
      category.products.push(newProduct);
    } else {
      productsDoc.categories.push({
        name: categoryName,
        products: [newProduct],
      });
    }

    await productsDoc.save();
    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add product", error: err.message });
  }
}

export async function removeProductFromCategory(req, res) {
  try {
    const { categoryName, productId } = req.body;
    if (!categoryName || !productId) {
      return res.status(400).json({ message: "categoryName and productId are required" });
    }

    const doc = await products.findOne();
    if (!doc) return res.status(404).json({ message: "Products document not found" });

    const category = doc.categories.find((item) => item.name === categoryName);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const previousLength = category.products.length;
    category.products = category.products.filter((item) => Number(item.id) !== Number(productId));

    if (category.products.length === previousLength) {
      return res.status(404).json({ message: "Product not found" });
    }

    await doc.save();
    return res.status(200).json({ message: "Product removed successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove product", error: err.message });
  }
}

export async function placeOrder(req, res) {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "items, totalAmount and paymentMethod are required" });
    }

    const order = await Order.create({
      items,
      totalAmount,
      paymentMethod,
    });

    return res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    return res.status(500).json({ message: "Failed to place order", error: err.message });
  }
}

export async function getAdminDashboard(req, res) {
  try {
    const data = await products.find().lean();
    const categories = data.flatMap((doc) => doc.categories || []);
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      categories,
      orders,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load admin dashboard", error: err.message });
  }
}
