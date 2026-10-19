import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_Backend_base_ULR;

const Userelectri = () => {
  const navigate = useNavigate();

  const [electri, setelectri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [failedImages, setFailedImages] = useState({});

  // Fetch ONLY electricians from the public API
  const electrisumit = useCallback(async () => {
    if (!API) {
      setErrorMessage(
        "Backend API URL .env file mein set nahi hai."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API}/workerroute/electribookApi`
      );

      console.log("Electrician API response:", response.data);

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.msg ||
            response.data?.message ||
            "Electricians ka data load nahi hua."
        );
      }

      // New backend response: electricians
      // Old response fallback: ebooking
      const workers = Array.isArray(response.data.electricians)
        ? response.data.electricians
        : Array.isArray(response.data.ebooking)
        ? response.data.ebooking
        : [];

      // Sirf electrician records show karo
      const onlyElectricians = workers.filter(
        (worker) =>
          worker.Electrician === true &&
          worker.Plumber !== true
      );

      setelectri(onlyElectricians);
      setFailedImages({});
    } catch (error) {
      console.error(
        "Electrician data fetch error:",
        error.response?.data || error
      );

      setelectri([]);

      setErrorMessage(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          error.message ||
          "Electrician data load nahi ho saka. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    electrisumit();
  }, [electrisumit]);

  // Booking page par selected electrician bhejo
  const bookNow = (worker) => {
    if (!worker?._id) {
      alert("Electrician ki ID nahi mili. Please refresh karein.");
      return;
    }

    navigate(`/Electrition/${worker._id}`, {
      state: {
        electrician: worker,
      },
    });
  };

  // Contact number
  const getContactNumber = (worker) =>
    worker?.ContactNumber ||
    worker?.PhoneNumber ||
    worker?.phonenumber ||
    worker?.usernumber ||
    worker?.phone ||
    worker?.MobileNumber ||
    worker?.WhatsApp ||
    worker?.Phone ||
    "";

  // Shop location
  const getShopLocation = (worker) =>
    worker?.ShopLocation ||
    worker?.shoplocation ||
    worker?.PhysicalShopLocation ||
    worker?.Location ||
    worker?.location ||
    worker?.OurShop?.shoplocation ||
    worker?.OurShop?.ShopLocation ||
    worker?.OurShop?.PhysicalShopLocation ||
    worker?.OurShop?.PhysicalShoplocation ||
    "Location not available";

  // Image URL
  const getImage = (worker) =>
    worker?.Image ||
    worker?.image ||
    worker?.Imageurl ||
    worker?.imageUrl ||
    worker?.UserImg ||
    "";

  // Electrician name
  const getName = (worker) =>
    worker?.Name ||
    worker?.name ||
    worker?.Yourname ||
    worker?.YourName ||
    worker?.FullName ||
    "Professional Electrician";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/booking")}
            className="rounded-xl bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
          >
            ← Back
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            BANNU ONLINE SERVICES
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book an Electrician
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Find professional electricians for wiring, electrical
            repairs, switches, lights and installation services.
          </p>

          {!loading && !errorMessage && (
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
                  <path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z" />
                </svg>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Electricians Available
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {electri.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="mt-4 font-medium text-slate-600">
              Loading electricians...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to Load Electricians
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={electrisumit}
              className="mt-5 rounded-xl bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !errorMessage &&
          electri.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
              <div className="text-5xl">⚡</div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No Electricians Found
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Abhi koi electrician available nahi hai. Electrician
                profile create hone ke baad yahan show hogi.
              </p>

              <button
                type="button"
                onClick={electrisumit}
                className="mt-5 rounded-xl bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
              >
                Refresh
              </button>
            </div>
          )}

        {/* Electrician Cards */}
        {!loading &&
          !errorMessage &&
          electri.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {electri.map((worker) => {
                const phone = getContactNumber(worker);
                const location = getShopLocation(worker);
                const name = getName(worker);
                const image = getImage(worker);
                const imageFailed =
                  !image || failedImages[worker._id];

                return (
                  <article
                    key={worker._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {!imageFailed ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          onError={() =>
                            setFailedImages((previous) => ({
                              ...previous,
                              [worker._id]: true,
                            }))
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z" />
                          </svg>

                          <span className="text-xs">
                            Image not available
                          </span>
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                        ELECTRICIAN
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="break-words text-xl font-bold text-slate-900">
                        {name}
                      </h2>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Electrical Service Provider
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
                            {location}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-500">
                        {worker.Description ||
                          "Contact this electrician for more information about available electrical services."}
                      </p>

                      {/* Booking Button */}
                      <button
                        type="button"
                        onClick={() => bookNow(worker)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        Book Now

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

export default Userelectri;
