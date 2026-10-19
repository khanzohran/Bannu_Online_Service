import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Admin2ndsidebar from "../components/Admin2ndsidebar";

const Allproduct = () => {
  const API = import.meta.env.VITE_Backend_base_ULR;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  // FETCH ELECTRICAL AND PLUMBING PRODUCTS
  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        axios.get(`${API}/EPcreate/EpfindApi`, {
          withCredentials: true,
        }),
        axios.get(`${API}/PPcreate/PPfindApi`, {
          withCredentials: true,
        }),
      ]);

      let allProducts = [];
      let failed = [];

      // ELECTRICAL PRODUCTS
      if (results[0].status === "fulfilled") {
        const data = results[0].value.data;

        if (Array.isArray(data.findobj)) {
          allProducts.push(
            ...data.findobj.map((item) => ({
              ...item,
              _category: "Electrical",
            }))
          );
        } else {
          failed.push("Electrical products ka response check karein.");
        }
      } else {
        failed.push("Electrical products load nahi huay.");
        console.error("Electrical API:", results[0].reason);
      }

      // PLUMBING PRODUCTS
      if (results[1].status === "fulfilled") {
        const data = results[1].value.data;

        if (Array.isArray(data.findobj)) {
          allProducts.push(
            ...data.findobj.map((item) => ({
              ...item,
              _category: "Plumbing",
            }))
          );
        } else {
          failed.push("Plumbing products ka response check karein.");
        }
      } else {
        failed.push("Plumbing products load nahi huay.");
        console.error("Plumbing API:", results[1].reason);
      }

      setProducts(allProducts);

      if (failed.length) {
        setError(failed.join(" "));
      }
    } catch (err) {
      console.error("Products error:", err);
      setError("Products load nahi huay. Backend API check karein.");
    } finally {
      setLoading(false);
    }
  }

  // LOAD PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [API]);

  // PRODUCT COUNTS
  const electricalCount = products.filter(
    (item) => item._category === "Electrical"
  ).length;

  const plumbingCount = products.filter(
    (item) => item._category === "Plumbing"
  ).length;

  // SEARCH AND CATEGORY FILTER
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        category === "All" || item._category === category;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        String(item.ProductName || "").toLowerCase().includes(searchText) ||
        String(item.Brand || "").toLowerCase().includes(searchText) ||
        String(item.Description || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    // Mobile: top header upar, content neeche (flex-col)
    // Desktop: sidebar left, content right (md:flex-row)
    <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
      {/* SIDEBAR */}
      <Admin2ndsidebar />

      <main className="min-w-0 w-full flex-1 p-3 sm:p-5 lg:p-7">
        {/* HEADER */}
        <section className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              All Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Electrical aur plumbing products ek jagah par.
            </p>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* TOTAL PRODUCTS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                📦
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Products
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {products.length}
                </h2>
              </div>
            </div>
          </div>

          {/* ELECTRICAL */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                ⚡
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Electrical
                </p>
                <h2 className="mt-1 text-xl font-bold text-blue-700">
                  {electricalCount}
                </h2>
              </div>
            </div>
          </div>

          {/* PLUMBING */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">
                🔧
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Plumbing
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {plumbingCount}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTER */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
             
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or brand..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 lg:max-w-xs"
            />
          </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchProducts}
              className="shrink-0 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        )}

        {/* PRODUCT COUNT */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            {category === "All" ? "All Products" : `${category} Products`}
          </h2>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {filteredProducts.length} items
          </span>
        </div>

        {/* COMPACT PRODUCT ROWS */}
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
            <p className="text-sm font-medium text-slate-600">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">📦</div>

            <h3 className="text-lg font-bold text-slate-800">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Search ya category change karke dobara check karein.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredProducts.map((item) => (
              <article
                key={`${item._category}-${item._id}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:gap-4"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-20 sm:w-20">
                  {item.Imageurl ? (
                    <img
                      src={item.Imageurl}
                      alt={item.ProductName || "Product"}
                      loading="lazy"
                      className="h-full w-full object-contain p-1 transition group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}

                  {Number(item.Discount) > 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 py-0.5 text-center text-[9px] font-bold text-white">
                      {item.Discount}% OFF
                    </span>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                      {item.ProductName || "Unnamed Product"}
                    </h3>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item._category === "Electrical"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item._category}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    Brand: {item.Brand || "Not specified"}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {item.Description || "No description available."}
                  </p>
                </div>

                {/* PRICE */}
                <div className="shrink-0 border-l border-slate-100 pl-3 text-right sm:pl-5">
                  <p className="text-sm font-extrabold text-blue-700 sm:text-base">
                    Rs. {Number(item.price || 0).toLocaleString()}
                  </p>

                  {Number(item.Discount) > 0 && (
                    <span className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {item.Discount}% OFF
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Allproduct;