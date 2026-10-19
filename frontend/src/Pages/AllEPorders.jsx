import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_Backend_base_ULR;

// ================= API CONFIGURATION =================

const CATEGORY = {
  Electrical: {
    find: "/Electerorder/myOrdersApi",
    remove: "/Electerorder/myOrderDeleteApi",
  },

  Plumbing: {
    find: "/plumborder/myOrdersApi",
    remove: "/plumborder/orderdeleteApi",
  },
};

const AllEPorders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ================= FIND BOTH ORDERS =================

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const categories = Object.keys(CATEGORY);

    try {
      const results = await Promise.allSettled(
        categories.map((category) =>
          axios.get(BASE + CATEGORY[category].find, {
            withCredentials: true,
          })
        )
      );

      const mergedOrders = [];
      const failedCategories = [];

      results.forEach((result, index) => {
        const category = categories[index];

        if (
          result.status === "fulfilled" &&
          result.value.data.success !== false
        ) {
          const list = result.value.data.orderfindobj;

          if (Array.isArray(list)) {
            list.forEach((order) => {
              mergedOrders.push({
                ...order,
                category,
              });
            });
          }
        } else {
          failedCategories.push(category);
        }
      });

      setOrders(mergedOrders);

      if (failedCategories.length > 0) {
        setErrorMessage(
          `${failedCategories.join(" aur ")} orders load nahi ho sake.`
        );
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      setErrorMessage("Orders load nahi ho sake. API check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= DELETE ORDER =================

  const handleDelete = async (order) => {
    const id = order._id;

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      `Kya aap is ${order.category.toLowerCase()} order ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setErrorMessage("");

      const response = await axios.post(
        BASE + CATEGORY[order.category].remove,
        { _id: id },
        { withCredentials: true }
      );

      if (response.data.success === true) {
        setOrders((previous) =>
          previous.filter(
            (item) =>
              !(
                item._id === id &&
                item.category === order.category
              )
          )
        );
      } else {
        setErrorMessage(
          response.data.msg || "Order delete nahi ho saka."
        );
      }
    } catch (error) {
      console.error("Order delete error:", error);

      setErrorMessage(
        error.response?.data?.msg ||
          "Order delete nahi hua. Backend API check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER + SEARCH =================

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesCategory =
        filter === "All" || order.category === filter;

      const matchesSearch = [
        order.ProductName,
        order.Brand,
        order.Name,
        order.phonenumber,
        order.Location,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      return matchesCategory && matchesSearch;
    });
  }, [orders, filter, search]);

  const count = (category) =>
    category === "All"
      ? orders.length
      : orders.filter((order) => order.category === category).length;

  // ================= LOADING =================

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
              All Orders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your electrical and plumbing product orders in one place.
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* TOTAL ORDERS */}

        <div className="mb-6 flex flex-wrap gap-2">
          {["All", "Electrical", "Plumbing"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                if (name === "Electrical") {
                  navigate("/Adminelectericalorder");
                } else if (name === "Plumbing") {
                  navigate("/Allplumbingproduct");
                } else {
                  setFilter(name);
                }
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === name
                  ? "bg-blue-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400"
              }`}
            >
              {name}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  filter === name
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {count(name)}
              </span>
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}

        {visibleOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No Orders Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Selected category mein koi order nahi mila.
            </p>
          </div>
        ) : (
          /* ORDER CARDS */

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {visibleOrders.map((order) => (
              <div
                key={`${order.category}-${order._id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* PRODUCT */}

                <div className="flex flex-col sm:flex-row">
                  <div className="relative flex h-52 w-full shrink-0 items-center justify-center overflow-hidden bg-slate-100 sm:h-auto sm:min-h-56 sm:w-48">
                    {order.Imageurl ? (
                      <img
                        src={order.Imageurl}
                        alt={order.ProductName || "Product"}
                        className="h-full w-full object-contain p-3"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-sm text-slate-400">
                        No Image
                      </span>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-blue-950 px-3 py-1.5 text-[10px] font-bold text-white">
                      {order.category === "Electrical"
                        ? "⚡ Electrical"
                        : "🔧 Plumbing"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                      Product Details
                    </p>

                    <h2 className="mt-2 break-words text-xl font-bold text-slate-900">
                      {order.ProductName || "N/A"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Brand:{" "}
                      <span className="font-semibold text-slate-700">
                        {order.Brand || "N/A"}
                      </span>
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-blue-950 p-3 text-white">
                        <p className="text-[10px] text-blue-200">
                          PRICE
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          Rs. {Number(order.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-3 text-blue-950">
                        <p className="text-[10px] text-blue-500">
                          QUANTITY
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          {order.stock ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400">
                          DISCOUNT
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {order.Discount !== undefined &&
                          order.Discount !== null &&
                          order.Discount !== ""
                            ? `${order.Discount}%`
                            : "None"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400">
                          SIZE
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {order.size || "N/A"}
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
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400">
                        Customer Name
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {order.Name || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400">
                        Phone Number
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {order.phonenumber || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-[10px] text-blue-500">
                        Location
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-blue-950">
                        {order.Location || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400">
                        Order Date
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {order.Date || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllEPorders;