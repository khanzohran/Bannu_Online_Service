import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

const Adminplumbingorder = () => {
  const navigate = useNavigate();

  const [AllPlumbingorder, setAllPlumbingorder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const BASE = import.meta.env.VITE_Backend_base_ULR;

  // ================= FIND LOGGED-IN SHOP PLUMBING ORDERS =================
  async function Plumbingproductorder() {
    try {
      setLoading(true);

      const response = await axios.get(
        BASE + "/plumborder/myOrdersApi",
        { withCredentials: true }
      );

      const orders = response.data.orderfindobj || [];
      setAllPlumbingorder(orders);
    } catch (error) {
      console.log(
        "Plumbing Orders Fetch Error:",
        error.response?.data || error.message
      );

      setAllPlumbingorder([]);
    } finally {
      setLoading(false);
    }
  }

  // ================= DELETE OWN SHOP PLUMBING ORDER =================
  async function deletePlumbingOrder(id) {
    const confirmDelete = window.confirm(
      "Kya aap apni shop ka ye plumbing order delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await axios.post(
        BASE + "/plumborder/orderdeleteApi",
        { _id: id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllPlumbingorder((previousOrders) =>
          previousOrders.filter((order) => order._id !== id)
        );

        alert("Plumbing order successfully deleted!");
      }
    } catch (error) {
      console.log(
        "Plumbing Delete Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.msg ||
          "Order delete nahi hua. Please dobara try karein."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ================= LOAD ORDERS =================
  useEffect(() => {
    Plumbingproductorder();
  }, []);

  // ================= LOADING UI =================
  if (loading) {
    return (
      <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
        <AdminSidebar />

        <main className="flex min-w-0 flex-1 items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
            <p className="font-semibold text-blue-950">
              Loading Your Orders...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
      <AdminSidebar />

      <main className="min-w-0 w-full flex-1 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Seller Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-blue-950 sm:text-3xl">
              My Plumbing Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage orders for plumbing products from your shop.
            </p>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="mb-5 flex flex-wrap gap-2">
          {/* All Button */}
          <button
            type="button"
            onClick={() => navigate("/shoponwerallorders")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400"
          >
            All
          </button>

          {/* Electrical Button */}
          <button
            type="button"
            onClick={() => navigate("/Adminelectericalorder")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400"
          >
            Electrical
          </button>

          {/* Plumbing Button (Active on this page) */}
          <button
            type="button"
            className="rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition"
          >
            Plumbing
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
              {AllPlumbingorder.length}
            </span>
          </button>
        </div>

        {/* EMPTY ORDERS */}
        {AllPlumbingorder.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">📦</div>

            <h2 className="mt-3 text-lg font-bold text-slate-800">
              No Plumbing Orders Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Orders for your plumbing shop will appear here.
            </p>
          </div>
        ) : (
          /* ================= ORDER GRID ================= */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {AllPlumbingorder.map((eachData) => (
              <div
                key={eachData._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl"
              >
                {/* PRODUCT SECTION */}
                <div className="flex flex-col sm:flex-row">
                  {/* PRODUCT IMAGE */}
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-56 sm:w-52">
                    {eachData.Imageurl ? (
                      <img
                        src={eachData.Imageurl}
                        alt={eachData.ProductName || "Plumbing Product"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-blue-950 shadow">
                        Plumbing
                      </span>
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="min-w-0 flex-1 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                      Product Details
                    </p>

                    <h2 className="mt-1 break-words text-xl font-bold text-slate-900">
                      {eachData.ProductName || "N/A"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Brand:{" "}
                      <span className="font-semibold text-slate-700">
                        {eachData.Brand || "N/A"}
                      </span>
                    </p>

                    {/* PRICE AND QUANTITY */}
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-950 px-4 py-3 text-white">
                      <div>
                        <p className="text-[9px] text-blue-200">PRICE</p>
                        <p className="text-lg font-bold">
                          Rs. {eachData.price ?? 0}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] text-blue-200">QUANTITY</p>
                        <p className="text-lg font-bold">
                          {eachData.stock ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* DISCOUNT AND SIZE */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400">Discount</p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-800">
                          {eachData.Discount ?? "None"}
                          {eachData.Discount !== undefined &&
                          eachData.Discount !== null &&
                          eachData.Discount !== ""
                            ? "%"
                            : ""}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400">Size</p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-800">
                          {eachData.size || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div className="border-t border-slate-100 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Customer Information
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* CUSTOMER */}
                    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        👤
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-400">Customer</p>
                        <p className="truncate text-xs font-bold text-slate-800">
                          {eachData.Name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        📱
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-400">Phone Number</p>
                        <p className="truncate text-xs font-bold text-slate-800">
                          {eachData.phonenumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LOCATION AND DATE */}
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-blue-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        📍
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-blue-500">Location</p>
                        <p className="break-words text-xs font-bold text-blue-950">
                          {eachData.Location || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        📅
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-400">Order Date</p>
                        <p className="break-words text-xs font-bold text-slate-800">
                          {eachData.Date || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  {eachData.Description && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400">Description</p>
                      <p className="mt-1 text-xs leading-5 text-slate-700">
                        {eachData.Description}
                      </p>
                    </div>
                  )}

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    disabled={deletingId === eachData._id}
                    onClick={() => deletePlumbingOrder(eachData._id)}
                    className="mt-3 w-full rounded-xl bg-red-50 py-3 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === eachData._id
                      ? "Deleting..."
                      : "Delete Order"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Adminplumbingorder;