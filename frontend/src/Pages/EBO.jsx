
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const EBO = () => {
  const [electri, setelectri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============== FIND ELECTRICIAN BOOKINGS ==============

  const Ebookingsumit = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/Electer/Allbookapi`,
        { withCredentials: true }
      );

      console.log("Electrician Booking Data:", response.data);

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.msg || "Bookings fetch nahi ho sakin."
        );
      }

      const bookings = response.data?.Efind;

      if (!Array.isArray(bookings)) {
        throw new Error("Backend se booking list nahi mili.");
      }

      setelectri(bookings);
    } catch (err) {
      console.error(
        "Electrician Booking Fetch Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        "Bookings load nahi ho sakin."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Ebookingsumit();
  }, [Ebookingsumit]);

  // ============== FORMAT DATE ==============

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ============== MAIN UI ==============

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:h-screen lg:w-72">
          <AdminSidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Seller Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold text-blue-950 sm:text-3xl">
                  Electrician Bookings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage customer electrician service requests.
                </p>
              </div>

              <button
                type="button"
                onClick={Ebookingsumit}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10m0-6v6h6M4 13a8.1 8.1 0 0 0 14.9 4L21 14m0 6v-6h-6"
                  />
                </svg>

                {loading ? "Loading..." : "Refresh Bookings"}
              </button>
            </div>

            {/* NAVIGATION TABS */}
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Electrician
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {electri.length}
                </span>
              </button>
            </div>

            {/* TOTAL BOOKINGS */}
            {!loading && !error && (
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  ⚡
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Total Electrician Bookings
                  </p>
                  <p className="text-2xl font-bold text-blue-950">
                    {electri.length}
                  </p>
                </div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-900" />

                <p className="mt-4 text-sm font-semibold text-blue-950">
                  Loading Your Bookings...
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                  !
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  Unable to Load Bookings
                </h2>

                <p className="mt-2 break-words text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={Ebookingsumit}
                  className="mt-5 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && electri.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  ⚡
                </div>

                <h2 className="mt-4 text-lg font-bold text-blue-950">
                  No Electrician Bookings Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Customer service bookings yahan show hongi.
                </p>
              </div>
            )}

            {/* BOOKING CARDS */}
            {!loading && !error && electri.length > 0 && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {electri.map((booking, index) => (
                  <article
                    key={booking._id || index}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl"
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-center gap-4 border-b border-slate-100 bg-white p-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                        ⚡
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                          Service Booking
                        </p>

                        <h2 className="mt-1 break-words text-xl font-bold text-blue-950">
                          {booking.ElectricianName || "Electrician Booking"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          Booking #{index + 1}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
                        New Request
                      </span>
                    </div>

                    {/* CUSTOMER DETAILS */}
                    <div className="p-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        Customer Information
                      </p>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* NAME */}
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            👤
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400">
                              Customer Name
                            </p>

                            <p className="mt-1 break-words text-sm font-bold text-slate-800">
                              {booking.Name || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* PHONE */}
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            📱
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400">
                              Phone Number
                            </p>

                            {booking.usernumber ? (
                              <a
                                href={`tel:${booking.usernumber}`}
                                className="mt-1 block break-all text-sm font-bold text-blue-800 hover:underline"
                              >
                                {booking.usernumber}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm font-bold text-slate-800">
                                N/A
                              </p>
                            )}
                          </div>
                        </div>

                        {/* LOCATION */}
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-blue-50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            📍
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] text-blue-500">
                              Customer Location
                            </p>

                            <p className="mt-1 break-words text-sm font-bold text-blue-950">
                              {booking.location || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* DATE */}
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            📅
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400">
                              Booking Date
                            </p>

                            <p className="mt-1 break-words text-sm font-bold text-slate-800">
                              {formatDate(booking.Date)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PROBLEM */}
                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                          Problem / Required Work
                        </p>

                        <p className="mt-2 break-words text-sm font-semibold text-blue-950">
                          {booking.Problem || "Not specified"}
                        </p>
                      </div>

                      {/* DESCRIPTION */}
                      {booking.Description && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Additional Details
                          </p>

                          <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                            {booking.Description}
                          </p>
                        </div>
                      )}

                      {/* ELECTRICIAN INFORMATION */}
                      {(booking.ElectricianContactNumber ||
                        booking.ElectricianShopLocation ||
                        booking.ElectricianName) && (
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                            Electrician Information
                          </p>

                          {booking.ElectricianContactNumber && (
                            <div className="mb-3">
                              <p className="text-[10px] text-slate-400">
                                Electrician Contact
                              </p>

                              <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                                {booking.ElectricianContactNumber}
                              </p>
                            </div>
                          )}

                          {booking.ElectricianShopLocation && (
                            <div>
                              <p className="text-[10px] text-slate-400">
                                Shop Location
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {booking.ElectricianShopLocation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default EBO;
