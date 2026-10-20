
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const Allworker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch workers from all shops
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
        axios.get(`${API}/workerroute/AllElectritionFindApi`, {
          withCredentials: true,
        }),
        axios.get(`${API}/workerroute/AllPlumberFindApi`, {
          withCredentials: true,
        }),
      ]);

      const allWorkers = [];
      const errors = [];

      results.forEach((result, index) => {
        const type = index === 0 ? "Electrician" : "Plumber";

        if (result.status === "fulfilled") {
          const data = result.value.data;

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.workers)
              ? data.workers
              : Array.isArray(data?.findobj)
                ? data.findobj
                : Array.isArray(data?.Allworker)
                  ? data.Allworker
                  : [];

          allWorkers.push(
            ...list.map((worker) => ({
              ...worker,
              _workerType: type,
            }))
          );
        } else {
          console.error(`${type} API error:`, result.reason);
          errors.push(`${type} workers load nahi huay.`);
        }
      });

      setWorkers(allWorkers);

      if (errors.length) {
        setError(errors.join(" "));
      }
    } catch (err) {
      console.error("Workers error:", err);
      setError("Workers load nahi huay. Backend check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Shop name
  const getShopName = (worker) => {
    const shop = worker.BelongsToShop || worker.OurShop;

    if (typeof shop === "string") return shop;

    return (
      shop?.Shopname ||
      shop?.ShopName ||
      shop?.shopname ||
      shop?.name ||
      worker.Shopname ||
      worker.ShopName ||
      "Shop name not available"
    );
  };

  // Shop location
  const getLocation = (worker) =>
    worker.ShopLocation ||
    worker.shoplocation ||
    worker.OurShop?.shoplocation ||
    worker.OurShop?.ShopLocation ||
    worker.OurShop?.PhysicalShopLocation ||
    worker.BelongsToShop?.shoplocation ||
    "Location not available";

  // Worker image
  const getImage = (worker) =>
    worker.Image ||
    worker.Imageurl ||
    worker.image ||
    worker.ProfileImage ||
    worker.Photo ||
    "";

  // Contact number
  const getPhone = (worker) =>
    worker.ContactNumber ||
    worker.phonenumber ||
    worker.PhoneNumber ||
    worker.Phone ||
    worker.usernumber ||
    "";

  const electricians = workers.filter(
    (worker) => worker._workerType === "Electrician"
  ).length;

  const plumbers = workers.filter(
    (worker) => worker._workerType === "Plumber"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Admin Sidebar */}
      <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:h-screen lg:w-72">
        <AdminSidebar />
      </aside>

      {/* Main Page */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">

          {/* Header */}
          <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Bannu Online Services
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                All Workers
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                All shops ke electricians aur plumbers.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchWorkers}
              disabled={loading}
              className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </header>

          {/* Summary */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Total Workers",
                count: workers.length,
                icon: "👷",
              },
              {
                title: "Electricians",
                count: electricians,
                icon: "⚡",
              },
              {
                title: "Plumbers",
                count: plumbers,
                icon: "🔧",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                      {item.count}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Section Heading */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Shop Workers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Electricians aur plumbers ki complete list.
              </p>
            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
              {workers.length} Workers
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
              <p className="mt-4 text-sm text-slate-500">
                Loading all shop workers...
              </p>
            </div>
          ) : workers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="text-5xl">👷</div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No Workers Found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Workers nahi mile. Backend APIs aur database check karein.
              </p>
            </div>
          ) : (
            /* Four cards per row on large screens */
            <section className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {workers.map((worker, index) => {
                const image = getImage(worker);
                const phone = getPhone(worker);
                const isElectrician =
                  worker._workerType === "Electrician";

                return (
                  <article
                    key={`${worker._workerType}-${worker._id || index}`}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {image ? (
                        <img
                          src={image}
                          alt={worker.Name || worker.name || "Worker"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}

                      <div
                        className={`${
                          image ? "hidden" : "flex"
                        } absolute inset-0 items-center justify-center text-6xl`}
                      >
                        {isElectrician ? "⚡" : "🔧"}
                      </div>

                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm">
                        {isElectrician ? "⚡ Electrician" : "🔧 Plumber"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {worker.Name || worker.name || "Worker"}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Professional {worker._workerType}
                      </p>

                      <div className="mt-4 space-y-3">
                        {/* Phone */}
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            📞
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              Contact Number
                            </p>
                            {phone ? (
                              <a
                                href={`tel:${phone}`}
                                className="break-all text-sm font-semibold text-slate-700 hover:text-blue-700"
                              >
                                {phone}
                              </a>
                            ) : (
                              <p className="text-sm text-slate-500">
                                Not provided
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Shop */}
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            🏪
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              Shop Name
                            </p>
                            <p className="break-words text-sm font-semibold text-slate-800">
                              {getShopName(worker)}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            📍
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              Shop Location
                            </p>
                            <p className="break-words text-sm font-medium leading-5 text-slate-700">
                              {getLocation(worker)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {worker.Description && (
                        <p className="mt-4 border-t border-slate-100 pt-3 text-sm leading-5 text-slate-500">
                          {worker.Description}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <footer className="mt-8 pb-4 text-center text-xs text-slate-400">
            Bannu Online Services · All Shops Worker Management
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Allworker;
