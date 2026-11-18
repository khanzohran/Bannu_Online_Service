
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Order = () => {
  const Params = useParams();
  const navigate = useNavigate();

  const BASE = (import.meta.env.VITE_Backend_base_ULR || "").replace(/\/+$/, "");

  // ================= ORDER STATE =================
  const [orderstate, setorderstate] = useState({
    ProductName: "",
    Brand: "",
    Imageurl: "",
    price: 0,
    Discount: "",
    Description: "",

    Name: "",
    stock: "1",
    Location: "",
    size: "",
    phonenumber: "",
    Date: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ================= PRICE CALCULATION =================
  const quantity = Math.max(1, Number(orderstate.stock) || 1);
  const price = Number(orderstate.price) || 0;
  const totalPrice = price * quantity;

  const formatPrice = (amount) =>
    `Rs. ${Number(amount).toLocaleString("en-PK")}`;

  // ================= FIND ONE PLUMBING PRODUCT =================
  async function ordersubmit() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${BASE}/PPcreate/PPfindoneApi`,
        {
          id: Params.orderFindoneobj,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Plumbing Product Response:", response.data);

      const productData =
        response.data.Allfindoneobj ||
        response.data.allfindone ||
        response.data.orderFindoneobj;

      if (productData) {
        setorderstate((previous) => ({
          ...previous,
          ProductName: productData.ProductName || "",
          Brand: productData.Brand || "",
          Imageurl: productData.Imageurl || "",
          price: productData.price || 0,
          Discount: productData.Discount || "",
          Description: productData.Description || "",
          size: productData.size || "",
        }));
      } else {
        setError("Plumbing product not found.");
      }
    } catch (error) {
      console.log("Plumbing Product Find Error:", error);
      setError(
        error.response?.data?.msg ||
        "Unable to load plumbing product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ================= INPUT CHANGE =================
  function handleChange(event) {
    const { name, value } = event.target;

    setorderstate((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ================= QUANTITY BUTTONS =================
  function decreaseQuantity() {
    setorderstate((previous) => ({
      ...previous,
      stock: String(Math.max(1, (Number(previous.stock) || 1) - 1)),
    }));
  }

  function increaseQuantity() {
    setorderstate((previous) => ({
      ...previous,
      stock: String((Number(previous.stock) || 1) + 1),
    }));
  }

  // ================= CREATE PLUMBING ORDER =================
  async function orderCreate() {
    if (submitting) return;

    if (
      !orderstate.Name.trim() ||
      !orderstate.phonenumber.trim() ||
      !orderstate.Location.trim() ||
      !orderstate.stock ||
      Number(orderstate.stock) < 1
    ) {
      alert("Please enter your name, phone number, quantity, and location.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productId: Params.orderFindoneobj,
        Name: orderstate.Name.trim(),
        stock: Number(orderstate.stock),
        Location: orderstate.Location.trim(),
        size: orderstate.size,
        phonenumber: orderstate.phonenumber.trim(),
        Date: orderstate.Date,
      };

      console.log("Plumbing Order Payload:", payload);

      const response = await axios.post(
        `${BASE}/plumborder/ordercreateApi`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Plumbing Order Response:", response.data);

      if (response.data.success === true) {
        navigate("/PlumbingShop", {
          state: {
            orderSuccess: true,
          },
        });
      } else {
        alert(
          response.data.msg ||
          "Order could not be placed. Please try again."
        );
      }
    } catch (error) {
      console.log("Plumbing Order Create Error:", error);

      alert(
        error.response?.data?.msg ||
        "Order creation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ================= FIND PRODUCT ON PAGE LOAD =================
  useEffect(() => {
    if (Params.orderFindoneobj) {
      ordersubmit();
    } else {
      setLoading(false);
      setError("Product ID URL mein nahi mila.");
    }
  }, [Params.orderFindoneobj]);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700"></div>
          <p className="font-semibold text-blue-900">
            Loading plumbing product...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error && !orderstate.ProductName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v4m0 4h.01M10.3 3.8l-8 14A2 2 0 004 21h16a2 2 0 001.7-3.2l-8-14a2 2 0 00-3.4 0z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Product Not Available
          </h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-8 max-w-7xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Bannu Online Services
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Plumbing Product Order
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Review your selected plumbing product and enter your delivery
          information to place your order.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 lg:grid-cols-2">

        {/* ================================================= */}
        {/* PRODUCT DETAILS CARD */}
        {/* ================================================= */}
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* CARD HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Your Selection
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Product Details
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 8H6M10 21h.01M18 21h.01"
                />
              </svg>
            </div>
          </div>

          {/* PRODUCT CONTENT */}
          <div className="flex flex-1 flex-col p-5 sm:p-7">

            {/* PRODUCT IMAGE */}
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:h-72">
              {orderstate.Imageurl ? (
                <img
                  src={orderstate.Imageurl}
                  alt={orderstate.ProductName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg
                    className="mx-auto h-14 w-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 5h16v14H4zM8 9h8M8 13h5"
                    />
                  </svg>
                  <p className="mt-2 text-sm">No Product Image</p>
                </div>
              )}

              {orderstate.Discount && (
                <span className="absolute left-4 top-4 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                  {orderstate.Discount}% Discount
                </span>
              )}

              <span className="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
                Plumbing
              </span>
            </div>

            {/* PRODUCT NAME */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Selected Product
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {orderstate.ProductName}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Brand:
                <span className="ml-1 font-semibold text-slate-700">
                  {orderstate.Brand || "Not Specified"}
                </span>
              </p>
            </div>

            {/* PRICE CARDS */}
            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Unit Price
                </p>

                <p className="mt-2 text-lg font-extrabold text-blue-800">
                  {formatPrice(price)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Quantity
                </p>

                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  {quantity} Items
                </p>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {orderstate.Description || "No product description available."}
              </p>
            </div>

            {/* TOTAL AMOUNT */}
            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Total Order Amount
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatPrice(price)} × {quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-extrabold">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================================================= */}
        {/* CUSTOMER INFORMATION CARD */}
        {/* ================================================= */}
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* CARD HEADER */}
          <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m6-10a4 4 0 100-8 4 4 0 000 8zm10 10v-2a4 4 0 00-3-3.87m-1-11.13a4 4 0 010 7.75"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Customer Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter your details for delivery
              </p>
            </div>
          </div>

          {/* CUSTOMER FORM */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Full Name *
                </label>

                <input
                  name="Name"
                  value={orderstate.Name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Phone Number *
                </label>

                <input
                  name="phonenumber"
                  value={orderstate.phonenumber}
                  onChange={handleChange}
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* QUANTITY */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Product Quantity *
                </label>

                <div className="flex h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="h-full w-12 border-r border-slate-200 text-lg font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    −
                  </button>

                  <input
                    name="stock"
                    value={orderstate.stock}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="h-full min-w-0 flex-1 bg-transparent text-center text-sm font-bold text-slate-900 outline-none"
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="h-full w-12 border-l border-slate-200 text-lg font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SIZE */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Product Size
                </label>

                <input
                  name="size"
                  value={orderstate.size}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter product size"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* LOCATION */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Delivery Location *
                </label>

                <input
                  name="Location"
                  value={orderstate.Location}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your complete delivery address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DATE */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Order Date
                </label>

                <input
                  name="Date"
                  value={orderstate.Date}
                  onChange={handleChange}
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* ORDER SUMMARY */}
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Product Price</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(price)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Quantity</span>
                <span className="font-semibold text-slate-800">
                  {quantity}
                </span>
              </div>

              <div className="my-3 border-t border-blue-100"></div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Total Amount
                </span>

                <span className="text-xl font-extrabold text-blue-800">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={orderCreate}
                disabled={submitting || !orderstate.ProductName}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <p className="mx-auto mt-6 max-w-7xl text-center text-xs text-slate-400">
        Bannu Online Services · Plumbing & Electrical
      </p>

    </div>
  );
};

export default Order;
