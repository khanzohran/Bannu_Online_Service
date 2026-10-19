
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Admin2ndsidebar from "../components/Admin2ndsidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const Admindashbord = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchDashboardData = useCallback(async () => {
    if (!API) {
      setError("Backend API URL .env file mein set nahi hai.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      // 1. Electrical products
      axios.get(`${API}/EPcreate/EpfindApi`, {
        withCredentials: true,
      }),

      // 2. Plumbing products
      axios.get(`${API}/PPcreate/PPfindApi`, {
        withCredentials: true,
      }),

      // 3. Electrical orders
      axios.get(`${API}/Electerorder/orderfindApi`, {
        withCredentials: true,
      }),

      // 4. Plumbing orders
      axios.get(`${API}/plumborder/orderfindApi`, {
        withCredentials: true,
      }),

      // 5. Electricians
      axios.get(`${API}/workerroute/MyElectritionFindApi`, {
        withCredentials: true,
      }),

      // 6. Plumbers
      axios.get(`${API}/workerroute/MyPlumberFindApi`, {
        withCredentials: true,
      }),
    ]);

    const readArray = (result, keys = []) => {
      if (result.status !== "fulfilled") return [];

      const data = result.value.data;

      for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
      }

      return [];
    };

    const allProducts = [
      ...readArray(results[0], ["findobj"]).map((item) => ({
        ...item,
        _category: "Electrical",
      })),
      ...readArray(results[1], ["findobj"]).map((item) => ({
        ...item,
        _category: "Plumbing",
      })),
    ];

    const allOrders = [
      ...readArray(results[2], ["orderfindobj"]).map((item) => ({
        ...item,
        _category: "Electrical",
      })),
      ...readArray(results[3], ["orderfindobj"]).map((item) => ({
        ...item,
        _category: "Plumbing",
      })),
    ];

    const allWorkers = [
      ...readArray(results[4], ["workers"]).map((item) => ({
        ...item,
        _workerType: "Electrician",
      })),
      ...readArray(results[5], ["workers"]).map((item) => ({
        ...item,
        _workerType: "Plumber",
      })),
    ];

    setProducts(allProducts);
    setOrders(allOrders);
    setWorkers(allWorkers);

    const failedRequests = results.filter(
      (result) => result.status === "rejected"
    ).length;

    if (failedRequests > 0) {
      setError(
        `${failedRequests} API request(s) load nahi huay. Backend routes check karein.`
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalElectricalProducts = products.filter(
    (item) => item._category === "Electrical"
  ).length;

  const totalPlumbingProducts = products.filter(
    (item) => item._category === "Plumbing"
  ).length;

  const totalElectricalOrders = orders.filter(
    (item) => item._category === "Electrical"
  ).length;

  const totalPlumbingOrders = orders.filter(
    (item) => item._category === "Plumbing"
  ).length;

  const totalElectricians = workers.filter(
    (item) => item._workerType === "Electrician"
  ).length;

  const totalPlumbers = workers.filter(
    (item) => item._workerType === "Plumber"
  ).length;

  const searchText = search.trim().toLowerCase();

  const filteredProducts = products.filter((item) =>
    [
      item.ProductName,
      item.Brand,
      item._category,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    )
  );

  const filteredOrders = orders.filter((item) =>
    [
      item.ProductName,
      item.Name,
      item.Brand,
      item.phonenumber,
      item.Location,
      item._category,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    )
  );

  const filteredWorkers = workers.filter((item) =>
    [
      item.Name,
      item.ContactNumber,
      item._workerType,
      item.ShopLocation,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    )
  );

  const summaryCards = [
    {
      title: "Total Products",
      count: products.length,
      detail: `${totalElectricalProducts} Electrical · ${totalPlumbingProducts} Plumbing`,
      icon: "📦",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Total Orders",
      count: orders.length,
      detail: `${totalElectricalOrders} Electrical · ${totalPlumbingOrders} Plumbing`,
      icon: "🛒",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Total Workers",
      count: workers.length,
      detail: `${totalElectricians} Electricians · ${totalPlumbers} Plumbers`,
      icon: "👷",
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      {/* SIDEBAR */}
      <Admin2ndsidebar />

      {/* MAIN DASHBOARD */}
      <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Bannu Online Services
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Products, orders aur workers ka complete overview.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading..." : "↻ Refresh Dashboard"}
            </button>
          </header>

          {/* SUMMARY CARDS — ONE ROW ON DESKTOP */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <article
                key={card.title}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${card.color}`}
                  >
                    {card.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
                      {loading ? "—" : card.count}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {card.detail}
                </p>
              </article>
            ))}
          </section>

          {/* SEARCH */}
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="dashboard-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search dashboard
            </label>

            <input
              id="dashboard-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Product, customer, worker, phone..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* API ERROR */}
          {error && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>

              <button
                type="button"
                onClick={fetchDashboardData}
                className="w-fit rounded-lg border border-amber-300 px-3 py-2 font-semibold hover:bg-amber-100"
              >
                Try Again
              </button>
            </div>
          )}

          {/* PRODUCTS SECTION */}
          <DashboardSection
            title="Recent Products"
            subtitle="Electrical aur plumbing products"
            count={filteredProducts.length}
            onViewAll={() => navigate("/AdminAllproduct")}
            loading={loading}
            emptyText="Koi product nahi mila."
          >
            {filteredProducts.slice(0, 5).map((item) => (
              <article
                key={`${item._category}-${item._id}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {item.Imageurl ? (
                    <img
                      src={item.Imageurl}
                      alt={item.ProductName || "Product"}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {item.ProductName || "Unnamed Product"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item._category} · {item.Brand || "No brand"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-blue-700">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </article>
            ))}
          </DashboardSection>

          {/* ORDERS SECTION */}
          <DashboardSection
            title="Recent Orders"
            subtitle="Electrical aur plumbing customer orders"
            count={filteredOrders.length}
            onViewAll={() => navigate("/AdminAllorder")}
            loading={loading}
            emptyText="Koi order nahi mila."
          >
            {filteredOrders.slice(0, 5).map((item) => (
              <article
                key={`${item._category}-${item._id}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xl">
                  🛒
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {item.ProductName || "Product order"}
                  </h3>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {item.Name || "Customer"} · {item._category}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {item.phonenumber || "No phone"} · {item.Location || "No location"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-blue-700">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </article>
            ))}
          </DashboardSection>

          {/* WORKERS SECTION */}
          <DashboardSection
            title="Our Workers"
            subtitle="Electricians aur plumbers"
            count={filteredWorkers.length}
            onViewAll={() => navigate("/AdminAllworker")}
            loading={loading}
            emptyText="Koi worker nahi mila."
          >
            {filteredWorkers.slice(0, 5).map((item) => (
              <article
                key={`${item._workerType}-${item._id}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {item.Image ? (
                    <img
                      src={item.Image}
                      alt={item.Name || "Worker"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl">
                      {item._workerType === "Electrician" ? "⚡" : "🔧"}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {item.Name || item._workerType}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item._workerType}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {item.ContactNumber || "No contact number"}
                  </p>
                </div>
              </article>
            ))}
          </DashboardSection>

          {/* FOOTER */}
          <footer className="py-5 text-center text-xs text-slate-400">
            Bannu Online Services · Admin Dashboard
          </footer>
        </div>
      </main>
    </div>
  );
};

const DashboardSection = ({
  title,
  subtitle,
  count,
  onViewAll,
  loading,
  emptyText,
  children,
}) => {
  const hasItems = React.Children.count(children) > 0;

  return (
    <section className="mb-6 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {count} items
          </span>

          <button
            type="button"
            onClick={onViewAll}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            View All →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-500">
          Loading data...
        </div>
      ) : !hasItems ? (
        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {children}
        </div>
      )}
    </section>
  );
};

export default Admindashbord;
