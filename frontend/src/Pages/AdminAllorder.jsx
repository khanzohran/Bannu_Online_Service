
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Admin2ndsidebar from "../components/Admin2ndsidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const AdminAllorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // FETCH ELECTRICAL + PLUMBING ORDERS
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        axios.get(`${API}/Electerorder/orderfindApi`, {
          withCredentials: true,
        }),
        axios.get(`${API}/plumborder/orderfindApi`, {
          withCredentials: true,
        }),
      ]);

      const allOrders = [];
      const errors = [];

      // Electrical orders
      if (results[0].status === "fulfilled") {
        const data = results[0].value.data;

        if (data.success && Array.isArray(data.orderfindobj)) {
          allOrders.push(
            ...data.orderfindobj.map((item) => ({
              ...item,
              _category: "Electrical",
            }))
          );
        } else {
          errors.push(data.msg || "Electrical orders load nahi huay.");
        }
      } else {
        console.error("Electrical API error:", results[0].reason);
        errors.push(
          results[0].reason?.response?.data?.msg ||
            "Electrical orders load nahi huay."
        );
      }

      // Plumbing orders
      if (results[1].status === "fulfilled") {
        const data = results[1].value.data;

        if (data.success && Array.isArray(data.orderfindobj)) {
          allOrders.push(
            ...data.orderfindobj.map((item) => ({
              ...item,
              _category: "Plumbing",
            }))
          );
        } else {
          errors.push(data.msg || "Plumbing orders load nahi huay.");
        }
      } else {
        console.error("Plumbing API error:", results[1].reason);
        errors.push(
          results[1].reason?.response?.data?.msg ||
            "Plumbing orders load nahi huay."
        );
      }

      // Latest orders first
      allOrders.sort(
        (a, b) =>
          new Date(b.createdAt || b.Date || 0).getTime() -
          new Date(a.createdAt || a.Date || 0).getTime()
      );

      setOrders(allOrders);

      if (errors.length) {
        setError(errors.join(" "));
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Orders load nahi huay. Backend URL aur APIs check karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // SUMMARY COUNTS
  const electricalCount = orders.filter(
    (item) => item._category === "Electrical"
  ).length;

  const plumbingCount = orders.filter(
    (item) => item._category === "Plumbing"
  ).length;

  // SEARCH + CATEGORY FILTER
  const filteredOrders = useMemo(() => {
    const text = search.trim().toLowerCase();

    return orders.filter((item) => {
      const matchesCategory =
        category === "All" || item._category === category;

      const matchesSearch =
        !text ||
        [
          item.ProductName,
          item.Name,
          item.Brand,
          item.phonenumber,
          item.Location,
          item._id,
        ].some((value) =>
          String(value || "").toLowerCase().includes(text)
        );

      return matchesCategory && matchesSearch;
    });
  }, [orders, category, search]);

  const deleteOrder = async (item) => {
    const confirmed = window.confirm(
      `Kya aap ${item._category} ka ye order delete karna chahte hain?`
    );

    if (!confirmed) return;

    const deleteKey = `${item._category}-${item._id}`;
    setDeletingId(deleteKey);

    try {
      const deleteUrl =
        item._category === "Electrical"
          ? `${API}/Electerorder/orderdeleteApi`
          : `${API}/plumborder/orderdeleteApi`;

      const response = await axios.post(
        deleteUrl,
        { _id: item._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrders((previous) =>
          previous.filter(
            (order) =>
              !(
                order._id === item._id &&
                order._category === item._category
              )
          )
        );
      } else {
        alert(response.data.msg || "Order delete nahi hua.");
      }
    } catch (err) {
      console.error("Delete order error:", err);

     
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100 md:flex-row">
      {/* RESPONSIVE SIDEBAR */}
      <Admin2ndsidebar />

      {/* MAIN CONTENT */}
      <main className="min-w-0 w-full flex-1 p-3 sm:p-5 lg:p-7">
        {/* HEADER */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
            Admin Dashboard
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                All Orders
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Electrical aur plumbing ke tamam orders ek jagah manage karein.
              </p>
            </div>

            
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            icon="📦"
            title="Total Orders"
            count={orders.length}
          />

          <SummaryCard
            icon="⚡"
            title="Electrical Orders"
            count={electricalCount}
          />

          <SummaryCard
            icon="🔧"
            title="Plumbing Orders"
            count={plumbingCount}
          />
        </section>

        {/* SEARCH AND FILTERS */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
             
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, customer, phone..."
              className="w-70 min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

        {/* API ERROR */}
        {error && (
          <div className="mb-4 break-words rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="mt-2 font-bold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LIST HEADER */}
        <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">
            {category === "All" ? "All Orders" : `${category} Orders`}
          </h2>

          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {filteredOrders.length} orders
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
            <p className="text-sm text-slate-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center">
            <div className="mb-3 text-4xl">📦</div>

            <h3 className="text-lg font-bold text-slate-800">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Orders nahi mile ya search se koi result nahi aaya.
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-3">
            {filteredOrders.map((item) => {
              const key = `${item._category}-${item._id}`;
              const isDeleting = deletingId === key;

              return (
                <article
                  key={key}
                  className="flex min-w-0 w-full flex-col gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 sm:p-4 lg:flex-row lg:items-center lg:gap-4"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-24 sm:w-24 lg:self-center">
                    {item.Imageurl ? (
                      <img
                        src={item.Imageurl}
                        alt={item.ProductName || "Product"}
                        loading="lazy"
                        className="h-full w-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                        {item.ProductName || "Unnamed Product"}
                      </h3>

                      <span
                        className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                          item._category === "Electrical"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item._category}
                      </span>
                    </div>

                    <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                      Brand: {item.Brand || "N/A"} · Quantity:{" "}
                      {item.stock ?? 0} · Size: {item.size || "N/A"}
                    </p>

                    <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <p className="break-words">
                        <b>Customer:</b> {item.Name || "N/A"}
                      </p>

                      <p className="break-words">
                        <b>Phone:</b> {item.phonenumber || "N/A"}
                      </p>

                      <p className="break-words">
                        <b>Date:</b>{" "}
                        {String(item.Date || item.createdAt || "").slice(
                          0,
                          10
                        ) || "N/A"}
                      </p>

                      <p className="break-words">
                        <b>Location:</b> {item.Location || "N/A"}
                      </p>
                    </div>

                    {item.Description && (
                      <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                        <b>Description:</b> {item.Description}
                      </p>
                    )}
                  </div>

                  {/* PRICE + DELETE */}
                  <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:gap-4 lg:w-auto lg:min-w-32 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <div className="min-w-0 lg:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 break-words text-base font-extrabold text-blue-700">
                        Rs. {Number(item.price || 0).toLocaleString()}
                      </p>

                      {Number(item.Discount) > 0 && (
                        <p className="mt-1 text-[10px] font-bold text-emerald-600">
                          {item.Discount}% OFF
                        </p>
                      )}
                    </div>


                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-6 pb-3 text-center text-xs text-slate-400">
          Bannu Online Services · Order Management
        </footer>
      </main>
    </div>
  );
};

// SUMMARY CARD
const SummaryCard = ({ icon, title, count }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{count}</h2>
      </div>
    </div>
  </div>
);

export default AdminAllorder;
