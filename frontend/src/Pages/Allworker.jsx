
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Admin2ndsidebar from "../components/Admin2ndsidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const Allworker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  const fetchWorkers = useCallback(async () => {
    if (!API) {
      setError("Backend API URL .env file mein set nahi hai.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API}/workerroute/AllWorkersFindApi`,
        { withCredentials: true }
      );

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.message || "Workers load nahi huay."
        );
      }

      const list = Array.isArray(response.data.workers)
        ? response.data.workers
        : [];

      const normalizedWorkers = list.map((worker) => ({
        ...worker,
        _workerType: worker.Electrician
          ? "Electrician"
          : worker.Plumber
          ? "Plumber"
          : "Worker",
      }));

      setWorkers(normalizedWorkers);
      setFailedImages({});
    } catch (err) {
      console.error(
        "All workers API error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Workers load nahi huay. Backend API check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const getShopName = (worker) => {
    const shop = worker.BelongsToShop;

    if (typeof shop === "string" && shop.trim()) {
      return shop;
    }

    if (shop && typeof shop === "object") {
      return (
        shop.Shopname ||
        shop.ShopName ||
        shop.name ||
        "Shop name not available"
      );
    }

    const ourShop = worker.OurShop;

    if (ourShop && typeof ourShop === "object") {
      return (
        ourShop.Shopname ||
        ourShop.ShopName ||
        ourShop.name ||
        "Shop name not available"
      );
    }

    return "Shop name not available";
  };

  const getShopLocation = (worker) =>
    worker.ShopLocation ||
    worker.OurShop?.ShopLocation ||
    worker.OurShop?.shoplocation ||
    worker.OurShop?.PhysicalShopLocation ||
    "Location not available";

  const electricians = workers.filter(
    (worker) => worker._workerType === "Electrician"
  ).length;

  const plumbers = workers.filter(
    (worker) => worker._workerType === "Plumber"
  ).length;

  return (
      <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
                <Admin2ndsidebar />

      <div className="flex min-h-screen flex-col lg:flex-row">
       

        {/* Main content */}
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="mx-auto w-full max-w-none">
            {/* Header */}
            <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Bannu Online Services
              </p>

              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    All Workers
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Tamam shops ke electricians aur plumbers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchWorkers}
                  disabled={loading}
                  className="w-fit rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>
            </header>

            {/* Summary cards */}
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Total Workers"
                count={workers.length}
                icon="👷"
              />

              <SummaryCard
                title="Electricians"
                count={electricians}
                icon="⚡"
              />

              <SummaryCard
                title="Plumbers"
                count={plumbers}
                icon="🔧"
              />
            </section>

            {/* Error message */}
            {error && !loading && (
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

            {/* Section heading */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-800">
                Registered Workers
              </h2>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {workers.length} workers
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

                <p className="mt-3 text-sm text-slate-600">
                  Loading workers...
                </p>
              </div>
            ) : workers.length === 0 && !error ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="text-5xl">👷</div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  No Workers Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Abhi database mein koi worker available nahi hai.
                </p>
              </div>
            ) : (
              /* Full-width row layout */
              <section className="flex w-full flex-col gap-4">
                {workers.map((worker, index) => {
                  const key = String(worker._id || index);

                  const imageUrl =
                    typeof worker.Image === "string"
                      ? worker.Image.trim()
                      : typeof worker.Imageurl === "string"
                      ? worker.Imageurl.trim()
                      : "";

                  const imageFailed = !imageUrl || failedImages[key];

                  const electrician =
                    worker._workerType === "Electrician";

                  return (
                    <article
                      key={key}
                      className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:flex-row"
                    >
                      {/* Worker image */}
                      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-36 sm:w-36 md:w-44">
                        {!imageFailed ? (
                          <img
                            src={imageUrl}
                            alt={worker.Name || "Worker"}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={() =>
                              setFailedImages((previous) => ({
                                ...previous,
                                [key]: true,
                              }))
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                            <span className="text-4xl">
                              {electrician ? "⚡" : "🔧"}
                            </span>

                            <span className="text-xs">
                              Image not available
                            </span>
                          </div>
                        )}

                        <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blue-800 shadow-sm">
                          {worker._workerType}
                        </span>
                      </div>

                      {/* Worker details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center p-4 md:p-5">
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div className="min-w-0 flex-1">
                            <h3 className="break-words text-lg font-bold text-slate-900">
                              {worker.Name || "Worker"}
                            </h3>

                            <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                              {worker.Description ||
                                "No description available."}
                            </p>
                          </div>

                          <span className="w-fit shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                            {worker._workerType}
                          </span>
                        </div>

                        {/* Contact, shop and location */}
                        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-3">
                          {/* Contact number */}
                          <InfoRow
                            icon="☎"
                            label="Contact Number"
                            value={
                              worker.ContactNumber ? (
                                <a
                                  href={`tel:${worker.ContactNumber}`}
                                  className="break-all text-sm font-semibold text-slate-700 hover:text-blue-700"
                                >
                                  {worker.ContactNumber}
                                </a>
                              ) : (
                                "Not provided"
                              )
                            }
                          />

                          {/* Shop name */}
                          <InfoRow
                            icon="🏪"
                            label="Shop Name"
                            value={getShopName(worker)}
                          />

                          {/* Shop location */}
                          <InfoRow
                            icon="📍"
                            label="Shop Location"
                            value={getShopLocation(worker)}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}

            {/* Footer */}
            <footer className="mt-8 pb-3 text-center text-xs text-slate-400">
              Bannu Online Services · Admin Worker Management
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Summary card */
const SummaryCard = ({ title, count, icon }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          {count}
        </p>
      </div>
    </div>
  </div>
);

/* Worker information row */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex min-w-0 items-start gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-800">
      {icon}
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-xs text-slate-400">{label}</p>

      <div className="mt-1 break-words text-sm font-semibold leading-5 text-slate-700">
        {value}
      </div>
    </div>
  </div>
);

export default Allworker;
