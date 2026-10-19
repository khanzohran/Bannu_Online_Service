
import React, { useEffect, useState } from "react";
import axios from "axios";
import Admin2ndsidebar from "../components/Admin2ndsidebar";

const Adminshop = () => {
  const BASE = import.meta.env.VITE_Backend_base_ULR;

  const [Allshop, setAllshop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);

  async function fetchShops() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BASE}/Login/AllShopApi`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAllshop(response.data.shops || []);
      } else {
        setError(response.data.msg || "Shops load nahi huay.");
      }
    } catch (err) {
      console.error("Fetch shops error:", err.response?.data || err);
      setError(
        err.response?.data?.msg ||
          "Shops fetch nahi huay. Backend API check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}
      <Admin2ndsidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          
{/* Combined Header + Total Shops */}
<div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
    
    {/* Left: Page Heading */}
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
        🏪
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Bannu Online Services
        </p>

        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Registered Shops
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage and view all registered shop accounts.
        </p>
      </div>
    </div>

    {/* Right: Total Shops */}
    <div className="flex min-w-[190px] items-center justify-between gap-5 rounded-xl border border-blue-100 bg-blue-50/70 px-5 py-4 sm:min-w-[210px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
          Total Shops
        </p>

        <h2 className="mt-1 text-3xl font-black tabular-nums text-slate-900">
          {Allshop.length}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Registered accounts
        </p>
      </div>

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M5 10V20h14V10M4 10l1-6h14l1 6M9 20v-6h6v6"
          />
        </svg>
      </div>
    </div>

  </div>

  {/* Bottom accent line */}
  <div className="h-1 w-full bg-blue-700" />
</div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Shop accounts load ho rahe hain...
            </div>
          ) : Allshop.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mb-4 text-5xl">🏪</div>

              <h3 className="text-xl font-bold text-slate-800">
                No Shop Accounts Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Registration page par Shop role se signup hone ke baad
                accounts yahan show honge.
              </p>
            </div>
          ) : (
            /* Shop list - horizontal rows */
            <div className="space-y-4">
              {Allshop.map((shop, index) => (
                <div
                  key={shop._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                    {/* Shop identity */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                        🏪
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-base font-extrabold text-slate-900">
                          {shop.Name || "Name not available"}
                        </h3>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {shop.Email || "Email not available"}
                        </p>
                      </div>
                    </div>

                    {/* Registration number */}
                    <div className="min-w-0 lg:w-28">
                      <p className="text-xs font-semibold text-slate-400">
                        SHOP NO.
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        #{index + 1}
                      </p>
                    </div>

                    {/* Role */}
                    <div className="lg:w-28">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        {shop.Role || "Shop"}
                      </span>
                    </div>

                    {/* Registration date */}
                    <div className="lg:w-32">
                      <p className="text-xs font-semibold text-slate-400">
                        REGISTERED
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {shop.createdAt
                          ? new Date(shop.createdAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>

                    {/* Details button */}
                    <div className="lg:ml-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedShop(shop)}
                        className="w-full rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 sm:w-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Shop details modal */}
      {selectedShop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedShop(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                  Shop Information
                </p>

                <h2
                  id="shop-details-title"
                  className="mt-1 text-xl font-black text-slate-900"
                >
                  Shop Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedShop(null)}
                aria-label="Close details"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            {/* Modal content */}
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl">
                  🏪
                </div>

                <div className="min-w-0">
                  <h3 className="break-words font-extrabold text-slate-900">
                    {selectedShop.Name || "Name not available"}
                  </h3>

                  <p className="break-all text-sm text-slate-600">
                    {selectedShop.Email || "Email not available"}
                  </p>
                </div>
              </div>

              {[
                ["Full Name", selectedShop.Name],
                ["Email Address", selectedShop.Email],
                ["Role", selectedShop.Role],
                ["Account ID", selectedShop._id],
                [
                  "Registration Date",
                  selectedShop.createdAt
                    ? new Date(selectedShop.createdAt).toLocaleString()
                    : "Not available",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {value || "Not available"}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setSelectedShop(null)}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminshop;
