
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = (import.meta.env.VITE_Backend_base_ULR || "").replace(/\/+$/, "");

function AllOrder() {
  const Params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderstate, setOrderstate] = useState({
    Name: "",
    stock: 1,
    Location: "",
    size: "",
    phonenumber: "",
    Date: "",
  });

  const quantity = Math.max(1, Number(orderstate.stock) || 1);
  const price = Number(product?.price) || 0;
  const totalPrice = price * quantity;

  const formatPrice = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;

  // Fetch Product Details
  const ordersubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API}/EPcreate/EpfindoneApi`,
        { id: Params.orderFindoneobj },
        { withCredentials: true }
      );

      if (response.data?.success && response.data?.allfindone) {
        setProduct(response.data.allfindone);
      } else {
        setError(response.data?.msg || "Product not found.");
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.msg || "Unable to load product details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Params.orderFindoneobj) {
      ordersubmit();
    } else {
      setLoading(false);
      setError("Product ID is missing.");
    }
  }, [Params.orderFindoneobj]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setOrderstate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Increase Quantity
  const increaseQuantity = () => {
    setOrderstate((prev) => ({
      ...prev,
      stock: Math.max(1, Number(prev.stock) || 1) + 1,
    }));
  };

  // Decrease Quantity
  const decreaseQuantity = () => {
    setOrderstate((prev) => ({
      ...prev,
      stock: Math.max(1, Number(prev.stock) - 1),
    }));
  };

  // Place Order
  const handleOrder = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!orderstate.Name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!orderstate.phonenumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!orderstate.Location.trim()) {
      setError("Please enter your delivery location.");
      return;
    }

    if (!orderstate.Date) {
      setError("Please select your delivery date.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productId: Params.orderFindoneobj,
        Name: orderstate.Name.trim(),
        stock: quantity,
        Location: orderstate.Location.trim(),
        size: orderstate.size,
        phonenumber: orderstate.phonenumber.trim(),
        Date: orderstate.Date,
      };

      const response = await axios.post(
        `${API}/Electerorder/ordercreateApi`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSuccess("Your order has been placed successfully!");

        setTimeout(() => {
          navigate("/ElectricalShop", {
            state: { orderSuccess: true },
          });
        }, 1000);
      } else {
        setError(response.data?.msg || "Order could not be placed.");
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.msg || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-3">!</div>
          <h2 className="text-xl font-bold text-slate-900">
            Product Not Found
          </h2>
          <p className="text-slate-500 text-sm mt-2">{error}</p>

          <button
            onClick={() => navigate("/ElectricalShop")}
            className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <p className="text-blue-700 text-sm font-bold uppercase tracking-wider">
          Electrical Store
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Complete Your Order
        </h1>

        <p className="text-slate-500 mt-2">
          Review your product and provide your delivery information.
        </p>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}
      </div>

      {/* Main Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6">

        {/* Professional Product Details */}
        <div className="h-full min-w-0 rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col">

          {/* Product Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Product Details
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Review your selected product
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6"
                />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-5 sm:p-6 flex flex-col flex-1">

            {/* Product Image */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 overflow-hidden flex items-center justify-center">
              {product.Imageurl ? (
                <img
                  src={product.Imageurl}
                  alt={product.ProductName}
                  className="w-full h-full object-contain p-7 transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm font-medium">
                    Product Image Not Available
                  </p>
                </div>
              )}

              {Number(product.Discount) > 0 && (
                <div className="absolute top-4 left-4 bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg">
                  {product.Discount}% OFF
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-white px-3 py-2 rounded-lg">
                <span className="text-xs font-bold text-slate-600">
                  Electrical Product
                </span>
              </div>
            </div>

            {/* Product Name */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Selected Product
              </p>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight break-words">
                {product.ProductName}
              </h3>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  BRAND
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {product.Brand || "Not specified"}
                </span>
              </div>
            </div>

            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Unit Price
                </p>
                <p className="text-xl font-extrabold text-blue-800 mt-2 break-words">
                  {formatPrice(price)}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Discount
                </p>
                <p className="text-xl font-extrabold text-emerald-700 mt-2">
                  {Number(product.Discount) > 0
                    ? `${product.Discount}%`
                    : "No Discount"}
                </p>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-5 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 bg-blue-700 rounded-full"></div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Product Description
                </h4>
              </div>

              <p className="text-sm text-slate-500 leading-6 break-words">
                {product.Description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Total Amount */}
            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-slate-900 p-5 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm text-slate-300 font-medium">
                        Order Total Amount
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {quantity} × {formatPrice(price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-extrabold text-white break-words">
                        {formatPrice(totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/15 mt-4 pt-3 flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      Quantity Selected
                    </span>
                    <span className="text-sm font-bold text-blue-300">
                      {quantity} Items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-xl font-bold text-slate-900">
              Customer Information
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your details to place the order
            </p>
          </div>

          <form
            onSubmit={handleOrder}
            className="p-4 sm:p-5 flex-1 flex flex-col"
          >
            <div className="space-y-4 flex-1">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={orderstate.Name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phonenumber"
                  value={orderstate.phonenumber}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Quantity
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 text-xl font-bold hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    name="stock"
                    min="1"
                    value={orderstate.stock}
                    onChange={(e) => {
                      const value = e.target.value;
                      setOrderstate((prev) => ({
                        ...prev,
                        stock:
                          value === "" ? "" : Math.max(1, Number(value)),
                      }));
                    }}
                    className="flex-1 min-w-0 h-11 rounded-xl border border-slate-200 bg-slate-50 text-center font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-11 h-11 rounded-xl bg-blue-700 text-white text-xl font-bold hover:bg-blue-800 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Delivery Location
                </label>
                <input
                  type="text"
                  name="Location"
                  value={orderstate.Location}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Size (Optional)
                </label>
                <input
                  type="text"
                  name="size"
                  value={orderstate.size}
                  onChange={handleChange}
                  placeholder="Enter product size"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="Date"
                  value={orderstate.Date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Quantity</span>
                <span className="font-bold text-slate-800">
                  {quantity}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm mt-3">
                <span className="text-slate-500">Price per item</span>
                <span className="font-bold text-slate-800">
                  {formatPrice(price)}
                </span>
              </div>

              <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">
                  Grand Total
                </span>
                <span className="text-xl font-extrabold text-blue-700">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3.5 font-bold text-sm shadow-lg shadow-blue-100 transition"
            >
              {submitting
                ? "Placing Your Order..."
                : "Confirm & Place Order"}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Please check your information before confirming.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AllOrder;
