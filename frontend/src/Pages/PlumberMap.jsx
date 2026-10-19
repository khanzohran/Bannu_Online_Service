
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const PlumberMap = () => {
  const navigate = useNavigate();

  const [plumbers, setPlumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  // Fetch logged-in shop's plumbers
  const fetchPlumbers = useCallback(async () => {
    if (!API) {
      setError("Backend API URL .env file mein set nahi hai.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/workerroute/MyPlumberFindApi`,
        { withCredentials: true }
      );

      const workers = response.data?.workers;

      if (!Array.isArray(workers)) {
        throw new Error(
          response.data?.message ||
            "Backend response mein plumbers array nahi mila."
        );
      }

      setPlumbers(workers);
      setFailedImages({});
    } catch (err) {
      console.error(
        "Plumber Find Error:",
        err.response?.data || err
      );

      if (err.response?.status === 401) {
        setError(
          "Login session expire ho gaya hai. Dobara Shop account se login karo."
        );
      } else if (err.response?.status === 403) {
        setError(
          "Aap ko plumbers dekhne ki permission nahi hai."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Plumbers load nahi ho sake."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlumbers();
  }, [fetchPlumbers]);

  // Delete plumber
  const deletePlumber = async (id) => {
    if (!id) {
      alert("Plumber ID nahi mili.");
      return;
    }

    if (
      !window.confirm(
        "Kya aap waqai is plumber ko delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API}/workerroute/PlumberDeleteApi/${id}`,
        { withCredentials: true }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Plumber delete nahi ho saka."
        );
      }

      setPlumbers((prev) =>
        prev.filter((worker) => worker._id !== id)
      );

      setFailedImages((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.error(
        "Delete Plumber Error:",
        err.response?.data || err
      );

      if (err.response?.status === 401) {
        alert("Session expire ho gaya hai. Dobara login karo.");
      } else if (err.response?.status === 403) {
        alert(
          "Aap ko is plumber ko delete karne ki permission nahi hai."
        );
      } else {
        alert(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Plumber delete nahi ho saka."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Resolve shop location
  const getShopLocation = (worker) => {
    return (
      worker.ShopLocation ||
      worker.OurShop?.shoplocation ||
      worker.OurShop?.ShopLocation ||
      worker.OurShop?.PhysicalShopLocation ||
      "Location not available"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:h-screen lg:w-72">
          <AdminSidebar />
        </aside>

        {/* Main Content */}
        <main className="min-w-0 w-full flex-1 px-4 py-6 sm:px-6 lg:px-15">
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Bannu Online Services
              </p>

              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    All Plumbers
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Apne plumbers ke profiles, location aur contact details manage karein.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/Pumbercreate")}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <span className="text-lg leading-none">+</span>
                  Add New Plumber
                </button>
              </div>
{/* Four Navigation Buttons - Tailwind CSS */}
<div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

  {/* All */}
  <button
    type="button"
    onClick={() => navigate("/AdminAllworker")}
    className="flex items-center justify-center gap-2 rounded-xl border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z"
      />
    </svg>
    All
  </button>

  {/* Electrician */}
  <button
    type="button"
    onClick={() => navigate("/AllElectricianworker")}
    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 2-3 8h7l-6 12 1-9H6l7-11Z"
      />
    </svg>
    Electrician
  </button>

  {/* Plumber */}
  <button
    type="button"
    onClick={() => navigate("/AllPlumberworker")}
    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3v5a5 5 0 0 0 10 0V3M12 13v3a4 4 0 0 0 8 0v-2M17 3v5M5 3v5M3 3h4M15 3h4"
      />
    </svg>
    Plumber
  </button>

  {/* Booking */}
  <button
    type="button"
    onClick={() => navigate("/ElectritionOrder")}
    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3v4M8 3v4M3 11h18M9 16l2 2 4-4"
      />
    </svg>
    Booking
  </button>

</div>

              {/* Count */}
              {!loading && !error && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="10" cy="7" r="4" />
                      <path d="M20 8v6" />
                      <path d="M23 11h-6" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Your Plumbers
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {plumbers.length}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Loading your plumbers...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                  !
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  Unable to Load Plumbers
                </h2>

                <p className="mx-auto mt-2 max-w-lg break-words text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchPlumbers}
                  className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && plumbers.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  🔧
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  No Plumbers Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Aap ne abhi tak koi plumber add nahi kiya.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/Pumbercreate")}
                  className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Add Your First Plumber
                </button>
              </div>
            )}

            {/* Plumber Cards */}
            {!loading && !error && plumbers.length > 0 && (
              <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {plumbers.map((worker) => {
                  const imageUrl =
                    typeof worker.Image === "string"
                      ? worker.Image.trim()
                      : "";

                  const imageFailed =
                    !imageUrl || failedImages[worker._id];

                  return (
                    <article
                      key={worker._id}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
                    >
                      {/* Worker Image */}
                      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-slate-100 sm:h-40">
                        {!imageFailed ? (
                          <img
                            src={imageUrl}
                            alt={worker.Name || "Plumber"}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [worker._id]: true,
                              }))
                            }
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400">
                            <span className="text-5xl">🔧</span>
                            <span className="text-xs">
                              Image not available
                            </span>
                          </div>
                        )}

                        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                          Plumber
                        </span>
                      </div>

                      {/* Worker Details */}
                      <div className="p-4">
                        <h2 className="break-words text-lg font-bold text-slate-900">
                          {worker.Name || "Plumber"}
                        </h2>

                        {/* Contact Number */}
                        <div className="mt-3 flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              Contact Number
                            </p>

                            <a
                              href={`tel:${worker.ContactNumber || ""}`}
                              className="break-all text-sm font-medium text-slate-700 hover:text-blue-700"
                            >
                              {worker.ContactNumber || "Not provided"}
                            </a>
                          </div>
                        </div>

                        {/* Shop Location */}
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                                <circle cx="12" cy="10" r="2.5" />
                              </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-500">
                                Shop Location
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                                {getShopLocation(worker)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-3">
                          <p className="whitespace-pre-line break-words text-sm leading-5 text-slate-500">
                            {worker.Description ||
                              "No description available."}
                          </p>
                        </div>

                        {/* Update & Delete */}
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/PlumberUpdate/${worker._id}`)
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => deletePlumber(worker._id)}
                            disabled={deletingId === worker._id}
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === worker._id ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4h8v2" />
                                  <path d="m19 6-1 14H6L5 6" />
                                  <path d="M10 11v5" />
                                  <path d="M14 11v5" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlumberMap;
