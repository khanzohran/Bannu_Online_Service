
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AllOrder = () => {
  const Params = useParams();
  const navigate = useNavigate();

  // ================= ORDER STATE =================
  const [orderstate, setorderstate] = useState({
    // Product Data
    ProductName: "",
    Brand: "",
    Imageurl: "",
    price: 0,
    Discount: "",
    Description: "",

    // Customer Data
    Name: "",
    stock: "",
    Location: "",
    size: "",
    phonenumber: "",
    Date: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ================= FIND ONE PRODUCT =================
  async function ordersubmit() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_Backend_base_ULR +
          "/EPcreate/EpfindoneApi",
        {
          id: Params.orderFindoneobj,
        }
      );

      console.log("Product Response:", response.data);

      const productData = response.data.allfindone;

      if (productData) {
        setorderstate((previous) => ({
          ...previous,
          ProductName: productData.ProductName || "",
          Brand: productData.Brand || "",
          Imageurl: productData.Imageurl || "",
          price: productData.price || 0,
          Discount: productData.Discount || "",
          Description: productData.Description || "",
        }));
      }
    } catch (error) {
      console.log("Product Find Error:", error);
      alert("Unable to load product. Please try again.");
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

  // ================= CREATE ORDER =================
  async function orderCreate() {
    if (submitting) return;

    try {
      // Check customer fields
      if (
        !orderstate.Name.trim() ||
        !orderstate.stock ||
        Number(orderstate.stock) < 1 ||
        !orderstate.Location.trim() ||
        !orderstate.phonenumber.trim()
      ) {
        alert(
          "Please enter your name, phone number, quantity, and location."
        );
        return;
      }

      setSubmitting(true);

      // Product ID + Customer Data
      const payload = {
        productId: Params.orderFindoneobj,
        Name: orderstate.Name.trim(),
        stock: Number(orderstate.stock),
        Location: orderstate.Location.trim(),
        size: orderstate.size,
        phonenumber: orderstate.phonenumber.trim(),
        Date: orderstate.Date,
      };

      console.log("Final Order Payload:", payload);

      const response = await axios.post(
        import.meta.env.VITE_Backend_base_ULR +
          "/Electerorder/ordercreateApi",
        payload
      );

      console.log("Create Order Response:", response.data);

      // ================= SUCCESS NAVIGATION =================
      if (response.data.success === true) {
        navigate("/ElectricalShop", {
          state: {
            orderSuccess: true,
          },
        });
      } else {
        alert(
          response.data.message ||
            "Order could not be placed. Please try again."
        );
      }
    } catch (error) {
      console.log("Order Create Error:", error);

      alert(
        error.response?.data?.message ||
          "Order creation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ================= FIND PRODUCT ON PAGE LOAD =================
  useEffect(() => {
    ordersubmit();
  }, [Params.orderFindoneobj]);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-4xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Product Order
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Electrical Product Order
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your information to order this product.
          </p>
        </div>

        {/* ================= PRODUCT DETAILS ================= */}
        {orderstate.ProductName && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-slate-50 p-5 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img
                src={orderstate.Imageurl}
                alt={orderstate.ProductName}
                className="h-32 w-50 rounded-xl  bg-white object"
              />

              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-blue-600">
                  Selected Product
                </p>

                <h2 className="mt-1 text-xl font-bold text-blue-950">
                  {orderstate.ProductName}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Brand: {orderstate.Brand || "Not Specified"}
                </p>

                <p className="mt-1 text-lg font-bold text-blue-700">
                  Rs. {orderstate.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {orderstate.Description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= ORDER FORM ================= */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-blue-950">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Your Name
              </label>

              <input
                name="Name"
                value={orderstate.Name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Phone Number
              </label>

              <input
                name="phonenumber"
                value={orderstate.phonenumber}
                onChange={handleChange}
                type="tel"
                placeholder="Enter phone number"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Quantity / Stock
              </label>

              <input
                name="stock"
                value={orderstate.stock}
                onChange={handleChange}
                type="number"
                min="1"
                placeholder="Enter quantity"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Location
              </label>

              <input
                name="Location"
                value={orderstate.Location}
                onChange={handleChange}
                type="text"
                placeholder="Enter your location"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* SIZE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Size
              </label>

              <input
                name="size"
                value={orderstate.size}
                onChange={handleChange}
                type="text"
                placeholder="Enter product size"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Order Date
              </label>

              <input
                name="Date"
                value={orderstate.Date}
                onChange={handleChange}
                type="date"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* ORDER BUTTON */}
          <div className="mt-8 flex justify-end gap-3">
             <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="rounded-xl border border-blue-200 px-6 py-3 font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
            >
              Go Back
            </button>
            <button
              onClick={orderCreate}
              type="button"
              disabled={submitting}
              className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Order Product"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllOrder;
