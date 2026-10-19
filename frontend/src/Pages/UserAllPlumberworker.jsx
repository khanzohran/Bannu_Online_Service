
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_Backend_base_ULR;

const UserAllPlumberworker = () => {
  const navigate = useNavigate();

  const [plumberstate, setplumberstate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  // Sirf plumbers fetch karein
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
        `${API}/workerroute/plumberuserApi`
      );

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.message ||
            response.data?.msg ||
            "Plumbers ka data load nahi hua."
        );
      }

      // Backend ke response se sirf plumbers lena
      const plumbers = Array.isArray(response.data.plumbers)
        ? response.data.plumbers
        : Array.isArray(response.data.Electriuser)
        ? response.data.Electriuser.filter(
            (worker) =>
              worker.Plumber === true &&
              worker.Electrician !== true
          )
        : [];

      // Safety filter: sirf plumber records
      const onlyPlumbers = plumbers.filter(
        (worker) =>
          worker.Plumber === true &&
          worker.Electrician !== true
      );

      setplumberstate(onlyPlumbers);
      setFailedImages({});
    } catch (err) {
      console.error(
        "Plumber Fetch Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Plumbers load nahi ho sake."
      );

      setplumberstate([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlumbers();
  }, [fetchPlumbers]);

  // Shop location
  const getShopLocation = (plumber) => {
    return (
      plumber.ShopLocation ||
      plumber.OurShop?.shoplocation ||
      plumber.OurShop?.ShopLocation ||
      plumber.OurShop?.PhysicalShopLocation ||
      "Location not available"
    );
  };

  // Selected plumber ki booking
  const handleBooking = (plumber) => {
    navigate(`/PlumberBooking/${plumber._id}`, {
      state: { plumber },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/booking")}
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            BANNU ONLINE SERVICES
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book a Plumber
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Apne area ke plumbing service providers ki profiles,
            contact details aur shop location dekhein.
          </p>

          {!loading && !error && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Available Plumbers
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {plumberstate.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading plumbers...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchPlumbers}
              className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          plumberstate.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="text-5xl">🔧</div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No Plumbers Available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Abhi koi plumber available nahi hai. Plumber create
                hone ke baad woh yahan show hoga.
              </p>

              <button
                type="button"
                onClick={fetchPlumbers}
                className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Refresh
              </button>
            </div>
          )}

        {/* Plumber Cards */}
        {!loading &&
          !error &&
          plumberstate.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {plumberstate.map((plumber) => {
                const imageUrl =
                  typeof plumber.Image === "string"
                    ? plumber.Image.trim()
                    : "";

                const imageFailed =
                  !imageUrl || failedImages[plumber._id];

                return (
                  <article
                    key={plumber._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {!imageFailed ? (
                        <img
                          src={imageUrl}
                          alt={plumber.Name || "Plumber"}
                          loading="lazy"
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [plumber._id]: true,
                            }))
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                          <span className="text-5xl">🔧</span>
                          <span className="text-xs">
                            Image not available
                          </span>
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                        PLUMBER
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="break-words text-xl font-bold text-slate-900">
                        {plumber.Name || "Professional Plumber"}
                      </h2>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Plumbing Service Provider
                      </p>

                      {/* Contact */}
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <svg
                            width="19"
                            height="19"
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

                          {plumber.ContactNumber ? (
                            <a
                              href={`tel:${plumber.ContactNumber}`}
                              className="break-all text-sm font-semibold text-slate-700 hover:text-blue-700"
                            >
                              {plumber.ContactNumber}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-500">
                              Not provided
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                          <svg
                            width="19"
                            height="19"
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

                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            Shop Location
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                            {getShopLocation(plumber)}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-500">
                        {plumber.Description ||
                          "Contact this plumber for more information about available services."}
                      </p>

                      {/* Booking */}
                      <button
                        type="button"
                        onClick={() => handleBooking(plumber)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        Booking Now

                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

export default UserAllPlumberworker;
