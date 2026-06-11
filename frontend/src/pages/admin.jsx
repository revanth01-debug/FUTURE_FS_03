import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../utils/api";

function Admin() {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    categoryName: "",
    name: "",
    weight: "",
    price: "",
    image: "",
  });
  const [removeData, setRemoveData] = useState({
    categoryName: "",
    productId: "",
  });

  const loadDashboard = async () => {
    const response = await fetch(apiUrl("/admin/dashboard"));
    const data = await response.json();
    setCategories(data.categories || []);
    setOrders(data.orders || []);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const categoryNames = useMemo(
    () => categories.map((category) => category.name),
    [categories]
  );

  const selectedCategoryProducts =
    categories.find((category) => category.name === removeData.categoryName)?.products || [];

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const response = await fetch(apiUrl("/admin/products/add"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatusMessage(data.message || "Failed to add product");
      return;
    }

    setStatusMessage("Product added successfully");
    setForm({
      categoryName: "",
      name: "",
      weight: "",
      price: "",
      image: "",
    });
    await loadDashboard();
  };

  const handleRemoveProduct = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const response = await fetch(apiUrl("/admin/products/remove"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(removeData),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatusMessage(data.message || "Failed to remove product");
      return;
    }

    setStatusMessage("Product removed successfully");
    setRemoveData({
      categoryName: "",
      productId: "",
    });
    await loadDashboard();
  };

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage products and monitor placed orders.</p>
        {statusMessage ? <p className="mt-3 text-sm text-green-600">{statusMessage}</p> : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleAddProduct}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-3"
        >
          <h2 className="text-xl font-semibold text-slate-800">Add Product</h2>
          <input
            required
            className="w-full border border-slate-300 rounded-lg p-2"
            placeholder="Category Name"
            value={form.categoryName}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryName: event.target.value }))}
          />
          <input
            required
            className="w-full border border-slate-300 rounded-lg p-2"
            placeholder="Product Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className="w-full border border-slate-300 rounded-lg p-2"
            placeholder="Weight (e.g. 500g)"
            value={form.weight}
            onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
          />
          <input
            required
            className="w-full border border-slate-300 rounded-lg p-2"
            placeholder="Price (e.g. ₹120)"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          />
          <input
            className="w-full border border-slate-300 rounded-lg p-2"
            placeholder="Image URL"
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2">
            Add Product
          </button>
        </form>

        <form
          onSubmit={handleRemoveProduct}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-3"
        >
          <h2 className="text-xl font-semibold text-slate-800">Remove Product</h2>
          <select
            required
            className="w-full border border-slate-300 rounded-lg p-2"
            value={removeData.categoryName}
            onChange={(event) =>
              setRemoveData({
                categoryName: event.target.value,
                productId: "",
              })
            }
          >
            <option value="">Select Category</option>
            {categoryNames.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>

          <select
            required
            className="w-full border border-slate-300 rounded-lg p-2"
            value={removeData.productId}
            onChange={(event) =>
              setRemoveData((prev) => ({
                ...prev,
                productId: event.target.value,
              }))
            }
          >
            <option value="">Select Product</option>
            {selectedCategoryProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (ID: {product.id})
              </option>
            ))}
          </select>

          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2">
            Remove Product
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-slate-500 text-sm">No orders placed yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm text-slate-600">Order ID: {order._id}</p>
                <p className="text-sm text-slate-600">Payment: {order.paymentMethod}</p>
                <p className="text-sm font-semibold text-slate-800">Total: ₹{order.totalAmount}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                  {order.items.map((item) => (
                    <li key={`${order._id}-${item.id}`}>{item.name} x {item.count}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
