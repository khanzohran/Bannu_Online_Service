
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const AdminAllworker = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  // FETCH ELECTRICIANS + PLUMBERS
  const fetchWorkers = useCallback(async () => {
    if (!API) {
      setError("Backend API URL .env file mein set nahi hai.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        axios.get(
          `${API}/workerroute/MyElectritionFindApi`,
          { withCredentials: true }
        ),
        axios.get(
          `${API}/workerroute/MyPlumberFindApi`,
          { withCredentials: true }
        ),
      ]);

      const combinedWorkers = [];
      const errors = [];

      // Electricians
      if (results[0].status === "fulfilled") {
        const data = results[0].value.data;

        if (Array.isArray(data?.workers)) {
          combinedWorkers.push(
            ...data.workers.map((worker) => ({
              ...worker,
              _workerType: "Electrician",
            }))
          );
        } else {
          errors.push("Electrician API response format sahi nahi hai.");
        }
      } else {
        console.error("Electrician API:", results[0].reason);
        errors.push("Electricians load nahi huay.");
      }

      // Plumbers
      if (results[1].status === "fulfilled") {
        const data = results[1].value.data;

        if (Array.isArray(data?.workers)) {
          combinedWorkers.push(
            ...data.workers.map((worker) => ({
              ...worker,
              _workerType: "Plumber",
            }))
          );
        } else {
          errors.push("Plumber API response format sahi nahi hai.");
        }
      } else {
        console.error("Plumber API:", results[1].reason);
        errors.push("Plumbers load nahi huay.");
      }

      setWorkers(combinedWorkers);
      setFailedImages({});

      if (errors.length) {
        setError(errors.join(" "));
      }
    } catch (err) {
      console.error("Fetch workers error:", err);
      setError("Workers load nahi huay. Backend APIs check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // SHOP LOCATION
  const getShopLocation = (worker) => {
    return (
      worker.ShopLocation ||
      worker.OurShop?.shoplocation ||
      worker.OurShop?.ShopLocation ||
      worker.OurShop?.PhysicalShopLocation ||
      "Location not available"
    );
  };

  // SHOP NAME
  const getShopName = (worker) => {
    const shop = worker.BelongsToShop;

    if (typeof shop === "string") {
      return shop || "Shop name not available";
    }

    return (
      shop?.Shopname ||
      shop?.ShopName ||
      worker.OurShop?.Shopname ||
      worker.OurShop?.ShopName ||
      worker.OurShop?.name ||
      "Shop name not available"
    );
  };

  // FILTER WORKERS
  const filteredWorkers = useMemo(() => {
    return workers.filter(
      (worker) =>
        filter === "All" || worker._workerType === filter
    );
  }, [workers, filter]);

  const totalElectricians = workers.filter(
    (worker) => worker._workerType === "Electrician"
  ).length;

  const totalPlumbers = workers.filter(
    (worker) => worker._workerType === "Plumber"
  ).length;

  // DELETE WORKER
  const deleteWorker = async (worker) => {
    if (!worker._id) {
      alert("Worker ID nahi mili.");
      return;
    }

    const type = worker._workerType;

    const confirmed = window.confirm(
      `Kya aap waqai is ${type.toLowerCase()} ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    const endpoint =
      type === "Electrician"
        ? `${API}/workerroute/ElectritionDeleteApi/${worker._id}`
        : `${API}/workerroute/PlumberDeleteApi/${worker._id}`;

    const key = `${type}-${worker._id}`;

    try {
      setDeletingId(key);

      const response = await axios.delete(endpoint, {
        withCredentials: true,
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Worker delete nahi ho saka."
        );
      }

      setWorkers((previous) =>
        previous.filter(
          (item) =>
            !(
              item._id === worker._id &&
              item._workerType === type
            )
        )
      );

      setFailedImages((previous) => {
        const updated = { ...previous };
        delete updated[key];
        delete updated[worker._id];
        return updated;
      });

    } catch (err) {
      console.error(
        "Delete worker error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Worker delete nahi ho saka."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // NAVIGATION BUTTONS
  const navigationButtons = [
    {
      label: "All Workers",
      icon: "👷",
      action: () => setFilter("All"),
      active: filter === "All",
    },
    {
      label: "Electrician",
      icon: "⚡",
      action: () => navigate("/AllElectricianworker"),
      active: false,
    },
    {
      label: "Plumber",
      icon: "🔧",
      action: () => navigate("/AllPlumberworker"),
      active: false,
    },
    {
      label: "Booking",
      icon: "📅",
      // Agar tumhara booking route different hai to ise change karna.
      action: () => navigate("/ElectritionOrder"),
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:h-screen lg:w-72">
          <AdminSidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Bannu Online Services
              </p>

              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    All Workers
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Electricians aur plumbers ko ek hi jagah se manage karein.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchWorkers}
                  disabled={loading}
                  className="w-fit rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>
            </header>

            {/* NAVIGATION BUTTONS — NO SEARCH */}
            <section className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {navigationButtons.map((button) => (
                  <button
                    key={button.label}
                    type="button"
                    onClick={button.action}
                    className={`flex min-w-0 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                      button.active
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <span>{button.icon}</span>
                    <span className="truncate">{button.label}</span>

                    {button.label === "All Workers" && (
                      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px]">
                        {workers.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* SUMMARY CARDS */}
            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard
                icon="👷"
                title="Total Workers"
                count={workers.length}
              />

              <SummaryCard
                icon="⚡"
                title="Electricians"
                count={totalElectricians}
              />

              <SummaryCard
                icon="🔧"
                title="Plumbers"
                count={totalPlumbers}
              />
            </section>

            {/* ERROR */}
            {!loading && error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>

                <button
                  type="button"
                  onClick={fetchWorkers}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* LIST HEADING */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800">
                {filter === "All" ? "All Workers" : `${filter} Workers`}
              </h2>

              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {filteredWorkers.length} workers
              </span>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
                <p className="mt-3 text-sm text-slate-600">
                  Loading workers...
                </p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              /* EMPTY STATE */
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {filter === "Plumber"
                    ? "🔧"
                    : filter === "Electrician"
                    ? "⚡"
                    : "👷"}
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  No Workers Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Is category mein abhi koi worker available nahi hai.
                </p>
              </div>
            ) : (
              /* WORKER CARDS */
              <section className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredWorkers.map((worker) => {
                  const imageUrl =
                    typeof worker.Image === "string"
                      ? worker.Image.trim()
                      : "";

                  const workerKey =
                    `${worker._workerType}-${worker._id}`;

                  const imageFailed =
                    !imageUrl || failedImages[workerKey];

                  const isElectrician =
                    worker._workerType === "Electrician";

                  return (
                    <article
                      key={workerKey}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* IMAGE */}
                      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-100">
                        {!imageFailed ? (
                          <img
                            src={imageUrl}
                            alt={worker.Name || worker._workerType}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={() =>
                              setFailedImages((previous) => ({
                                ...previous,
                                [workerKey]: true,
                              }))
                            }
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400">
                            <span className="text-5xl">
                              {isElectrician ? "⚡" : "🔧"}
                            </span>
                            <span className="text-xs">
                              Image not available
                            </span>
                          </div>
                        )}

                        <span
                          className={`absolute left-3 top-3 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-xs font-bold shadow-sm ${
                            isElectrician
                              ? "text-blue-700"
                              : "text-indigo-700"
                          }`}
                        >
                          {worker._workerType}
                        </span>
                      </div>

                      {/* WORKER DETAILS */}
                      <div className="p-4">
                        <h2 className="break-words text-lg font-bold text-slate-900">
                          {worker.Name || worker._workerType}
                        </h2>

                        {/* CONTACT */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            ☎
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              Contact Number
                            </p>

                            {worker.ContactNumber ? (
                              <a
                                href={`tel:${worker.ContactNumber}`}
                                className="break-all text-sm font-medium text-slate-700 hover:text-blue-700"
                              >
                                {worker.ContactNumber}
                              </a>
                            ) : (
                              <p className="text-sm text-slate-500">
                                Not provided
                              </p>
                            )}
                          </div>
                        </div>

                        {/* SHOP */}
                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <span className="text-lg">🏪</span>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Shop Name
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                              {getShopName(worker)}
                            </p>
                          </div>
                        </div>

                        {/* LOCATION */}
                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <span className="text-lg">📍</span>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Shop Location
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                              {getShopLocation(worker)}
                            </p>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="mt-3 whitespace-pre-line break-words text-sm leading-5 text-slate-500">
                          {worker.Description ||
                            "No description available."}
                        </p>

                     
                      </div>
                    </article>
                  );
                })}
              </section>
            )}

            {/* FOOTER */}
            <footer className="mt-6 pb-3 text-center text-xs text-slate-400">
              Bannu Online Services · Worker Management
            </footer>
          </div>
        </main>
      </div>
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
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          {count}
        </h2>
      </div>
    </div>
  </div>
);

export default AdminAllworker;
