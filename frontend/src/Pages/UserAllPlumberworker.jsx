import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserAllPlumberworker = () => {
  const navigate = useNavigate();
  const [plumberstate, setplumberstate] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_Backend_base_ULR}/workerroute/plumberuserApi`
      )
      .then((response) => {
        setplumberstate(
          response.data?.Electriuser ||
            response.data?.workers ||
            response.data?.plumbers ||
            []
        );
      })
      .catch((error) => {
        console.error("Plumber Fetch Error:", error);
      });
  }, []);

  const handleBooking = (plumber) => {
    navigate(`/PlumberBooking/${plumber._id}`, {
      state: { plumber },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
 {/* BACK BUTTON */}
        <div className="max-w-7xl mx-auto mb-6">
          <button
            onClick={() => navigate("/booking")}
            className="bg-blue-800 hover:bg-blue-950 text-white px-5 py-2 rounded-lg font-medium transition duration-300"
          >
            ← Back
          </button>
        </div>
        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            BANNU ONLINE SERVICES
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book a Plumber
          </h1>

         

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
            </span>

            {plumberstate.length} Plumbers Available
          </div>
        </div>

        {/* Plumber Cards */}
        {plumberstate.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {plumberstate.map((plumber) => (
              <article
                key={plumber._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Plumber Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {plumber.Image ? (
                    <img
                      src={plumber.Image}
                      alt={plumber.Name || "Plumber"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-slate-300"
                      >
                        <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4l-3.2 3.2-3-3z" />
                      </svg>
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                    PLUMBER
                  </span>
                </div>

                {/* Plumber Information */}
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
                        {plumber.ShopLocation ||
                          plumber.OurShop?.shoplocation ||
                          plumber.OurShop?.ShopLocation ||
                          plumber.OurShop?.PhysicalShopLocation ||
                          "Location not available"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-500">
                    {plumber.Description ||
                      "Contact this plumber for more information about available services."}
                  </p>

                  {/* Booking Button */}
                  <button
                    type="button"
                    onClick={() => handleBooking(plumber)}
                    className="mt-auto mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="text-5xl">🔧</div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No Plumbers Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Plumbers will appear here when their profiles are available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAllPlumberworker;
