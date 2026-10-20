
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
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);

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
      axios.get(`${API}/EPcreate/EpfindApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/PPcreate/PPfindApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/Electerorder/orderfindApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/plumborder/orderfindApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/workerroute/AllWorkersFindApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/Login/AllShopApi`, {
        withCredentials: true,
      }),
      axios.get(`${API}/Login/AllCustomers`, {
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
      ...readArray(results[0], ["findobj", "products"]).map((item) => ({
        ...item,
        _category: "Electrical",
      })),
      ...readArray(results[1], ["findobj", "products"]).map((item) => ({
        ...item,
        _category: "Plumbing",
      })),
    ];

    const allOrders = [
      ...readArray(results[2], ["orderfindobj", "orders"]).map((item) => ({
        ...item,
        _category: "Electrical",
      })),
      ...readArray(results[3], ["orderfindobj", "orders"]).map((item) => ({
        ...item,
        _category: "Plumbing",
      })),
    ];

    const allWorkers = readArray(results[4], ["workers"]).map((item) => ({
      ...item,
      _workerType: item.Electrician
        ? "Electrician"
        : item.Plumber
        ? "Plumber"
        : "Worker",
    }));

    const allShops = readArray(results[5], ["shops"]);
    const allUsers = readArray(results[6], ["customers"]);

    setProducts(allProducts);
    setOrders(allOrders);
    setWorkers(allWorkers);
    setShops(allShops);
    setUsers(allUsers);

    const failedRequests = results.filter(
      (result) => result.status === "rejected"
    ).length;

    if (failedRequests > 0) {
      setError(
        `${failedRequests} API request(s) load nahi huay. Backend routes aur admin login check karein.`
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const query = search.trim().toLowerCase();

  const matchesSearch = (...values) =>
    !query ||
    values.some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

  const filteredProducts = products.filter((item) =>
    matchesSearch(item.ProductName, item.Brand, item._category)
  );

  const filteredOrders = orders.filter((item) =>
    matchesSearch(
      item.ProductName,
      item.Name,
      item.Brand,
      item.phonenumber,
      item.ContactNumber,
      item.Location,
      item._category
    )
  );

  const filteredWorkers = workers.filter((item) =>
    matchesSearch(
      item.Name,
      item.ContactNumber,
      item._workerType,
      item.ShopLocation,
      item.BelongsToShop
    )
  );

  const filteredShops = shops.filter((item) =>
    matchesSearch(item.Name, item.Email, item.Role)
  );

  const filteredUsers = users.filter((item) =>
    matchesSearch(item.Name, item.Email, item.Role)
  );

  const electricalProducts = products.filter(
    (item) => item._category === "Electrical"
  ).length;

  const plumbingProducts = products.filter(
    (item) => item._category === "Plumbing"
  ).length;

  const electricalOrders = orders.filter(
    (item) => item._category === "Electrical"
  ).length;

  const plumbingOrders = orders.filter(
    (item) => item._category === "Plumbing"
  ).length;

  const electricians = workers.filter(
    (item) => item._workerType === "Electrician"
  ).length;

  const plumbers = workers.filter(
    (item) => item._workerType === "Plumber"
  ).length;

  const summaryCards = [
    {
      title: "Total Products",
      count: products.length,
      detail: `${electricalProducts} Electrical · ${plumbingProducts} Plumbing`,
      icon: "📦",
    },
    {
      title: "Total Orders",
      count: orders.length,
      detail: `${electricalOrders} Electrical · ${plumbingOrders} Plumbing`,
      icon: "🛒",
    },
    {
      title: "Total Workers",
      count: workers.length,
      detail: `${electricians} Electricians · ${plumbers} Plumbers`,
      icon: "👷",
    },
    {
      title: "Registered Shops",
      count: shops.length,
      detail: "Total shop accounts",
      icon: "🏪",
    },
    {
      title: "Registered Users",
      count: users.length,
      detail: "Total customer accounts",
      icon: "👥",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <Admin2ndsidebar />

      <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">
        <div className="mx-auto w-full max-w-none">
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
                Products, orders, workers, shops aur users ka complete overview.
              </p>
            </div>

           
          </header>

          {/* SUMMARY CARDS */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 ">
            {summaryCards.map((card) => (
              <article
                key={card.title}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4 h-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    {card.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h2 className=" text-3xl font-extrabold text-slate-900">
                      {loading ? "—" : card.count}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 h-2">
                  {card.detail}
                </p>
              </article>
            ))}
          </section>

          {/* SEARCH */}
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm w-100">
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
              placeholder="Search products, orders, workers, shops or users..."
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

          {/* PRODUCTS */}
          <DashboardSection
            title="Recent Products"
            subtitle="Electrical aur plumbing products"
            count={filteredProducts.length}
            onViewAll={() => navigate("/AdminAllproduct")}
            loading={loading}
            emptyText="Koi product nahi mila."
            hasItems={filteredProducts.length > 0}
          >
            {filteredProducts.slice(0, 5).map((item, index) => (
              <article
                key={item._id || `product-${index}`}
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

          {/* ORDERS */}
          <DashboardSection
            title="Recent Orders"
            subtitle="Electrical aur plumbing customer orders"
            count={filteredOrders.length}
            onViewAll={() => navigate("/AdminAllorder")}
            loading={loading}
            emptyText="Koi order nahi mila."
            hasItems={filteredOrders.length > 0}
          >
            {filteredOrders.slice(0, 5).map((item, index) => (
              <article
                key={item._id || `order-${index}`}
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
                    {item.phonenumber ||
                      item.ContactNumber ||
                      "No phone"}{" "}
                    · {item.Location || "No location"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-blue-700">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </article>
            ))}
          </DashboardSection>

          {/* WORKERS */}
          <DashboardSection
            title="Registered Workers"
            subtitle="Tamam shops ke electricians aur plumbers"
            count={filteredWorkers.length}
            onViewAll={() => navigate("/Allworker")}
            loading={loading}
            emptyText="Koi worker nahi mila."
            hasItems={filteredWorkers.length > 0}
          >
            {filteredWorkers.slice(0, 5).map((item, index) => {
              const image = item.Image || item.Imageurl;

              return (
                <article
                  key={item._id || `worker-${index}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {image ? (
                      <img
                        src={image}
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
                      {item.Name || "Worker"}
                    </h3>

                    <p className="mt-1 text-xs text-blue-700">
                      {item._workerType}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.ContactNumber || "No contact number"}
                    </p>
                  </div>
                </article>
              );
            })}
          </DashboardSection>

          {/* SHOPS */}
          <DashboardSection
            title="Registered Shops"
            subtitle="Dashboard par tamam registered shop accounts"
            count={filteredShops.length}
            onViewAll={() => navigate("/Adminshop")}
            loading={loading}
            emptyText="Koi registered shop nahi mili."
            hasItems={filteredShops.length > 0}
          >
            {filteredShops.slice(0, 5).map((shop, index) => (
              <article
                key={shop._id || `shop-${index}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  🏪
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {shop.Name || "Shop name not available"}
                  </h3>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {shop.Email || "Email not available"}
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    {shop.Role || "Shop"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Shop
                </span>
              </article>
            ))}
          </DashboardSection>

          {/* USERS */}
          <DashboardSection
            title="Registered Users"
            subtitle="Customer accounts registered on the website"
            count={filteredUsers.length}
            onViewAll={() => navigate("/admincustomers")}
            loading={loading}
            emptyText="Koi registered user nahi mila."
            hasItems={filteredUsers.length > 0}
          >
            {filteredUsers.slice(0, 5).map((user, index) => (
              <article
                key={user._id || `user-${index}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700">
                  {(user.Name || "U").trim().charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {user.Name || "Name not available"}
                  </h3>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {user.Email || "Email not available"}
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    {user.Role || "User"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  User
                </span>
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

/* Reusable dashboard section */
const DashboardSection = ({
  title,
  subtitle,
  count,
  onViewAll,
  loading,
  emptyText,
  hasItems,
  children,
}) => {
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
