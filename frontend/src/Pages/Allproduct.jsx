import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_Backend_base_ULR;

// Har category ki API aur routes yahan ek jagah likhe hain
const CATEGORY = {
  Electrical: {
    find: "/EPcreate/MyEpfindApi",
    remove: "/EPcreate/EPdeleteApi",
    update: (id) => `/Electerproupdate/${id}`,
    create: "/AdminEproductCraete",
  },
  Plumbing: {
    find: "/PPcreate/MyPpfindApi", // FIX: Ab ye sirf logged-in shop owner ke plumbing products layega
    remove: "/PPcreate/PPdelateApi",
    update: (id) => `/plumbproupdate/${id}`,
    create: "/AdminPproductcreate",
  },
};

const Allproduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ================= FETCH BOTH =================
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const names = Object.keys(CATEGORY);

    const results = await Promise.allSettled(
      names.map((name) =>
        axios.get(API + CATEGORY[name].find, { withCredentials: true })
      )
    );

    const merged = [];
    const failed = [];

    results.forEach((result, index) => {
      const name = names[index];
      if (result.status === "fulfilled" && result.value.data.success !== false) {
        const list = Array.isArray(result.value.data.findobj)
          ? result.value.data.findobj
          : [];
        list.forEach((item) => merged.push({ ...item, category: name }));
      } else {
        failed.push(name);
      }
    });

    setProducts(merged);
    if (failed.length) {
      setErrorMessage(`${failed.join(" aur ")} products load nahi ho sake.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= DELETE =================
  const handleDelete = async (product) => {
    if (deletingId) return;
    if (!window.confirm("Kya aap waqai is product ko delete karna chahte hain?"))
      return;

    try {
      setDeletingId(product._id);
      setErrorMessage("");

      const response = await axios.post(
        API + CATEGORY[product.category].remove,
        { id: product._id },
        { withCredentials: true }
      );

      if (response.data.success === true) {
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
      } else {
        setErrorMessage(response.data.msg || "Product delete nahi ho saka.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Delete nahi hua. Backend API check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER + SEARCH =================
  const visible = useMemo(() => {
    return products.filter((p) => {
      const okCategory = filter === "All" || p.category === filter;
      const okSearch = (p.ProductName || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return okCategory && okSearch;
    });
  }, [products, filter, search]);

  const count = (name) =>
    name === "All"
      ? products.length
      : products.filter((p) => p.category === name).length;

  // ================= UI =================
  return (
    <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
      <AdminSidebar />

      <main className="min-w-0 w-full flex-1 p-4 sm:p-5 md:p-8">
        {/* HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Shop Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl">
              All Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Electrical aur plumbing dono products yahan sirf aapki shop ke show honge.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="break-words text-sm">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Retry"}
            </button>
          </div>
        )}

        {/* FILTER TABS + SEARCH */}
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "Electrical", "Plumbing"].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (name === "Electrical") {
                    navigate("/allelecterproduct");
                  } else if (name === "Plumbing") {
                    navigate("/Allplumbingproduct");
                  } else {
                    setFilter(name);
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === name
                    ? "bg-blue-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400"
                }`}
              >
                {name}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    filter === name
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {count(name)}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Product ka naam search karo..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 md:max-w-xs"
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
            <p className="font-medium text-slate-600">Loading products...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">📦</div>
            <h2 className="text-xl font-bold text-slate-700">
              Koi product nahi mila
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Naya product banane ke liye upar wale Add button use karo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((eachData) => (
              <div
                key={`${eachData.category}-${eachData._id}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-100">
                  {eachData.Imageurl ? (
                    <img
                      src={eachData.Imageurl}
                      alt={eachData.ProductName || "Product"}
                      className="h-full w-full object-contain p-3"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-sm text-slate-400">No product image</span>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-bold text-blue-100">
                    {eachData.category === "Electrical" ? "⚡ Electrical" : "🔧 Plumbing"}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words text-lg font-bold text-slate-800">
                      {eachData.ProductName || "Unnamed Product"}
                    </h3>

                    {Number(eachData.Discount) > 0 && (
                      <span className="shrink-0 rounded-lg bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                        {eachData.Discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-2xl font-bold text-blue-700">
                    Rs. {Number(eachData.price || 0).toLocaleString()}
                  </p>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Brand</p>
                    <p className="font-semibold text-slate-700">
                      {eachData.Brand || "No brand"}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Description</p>
                    <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-slate-600">
                      {eachData.Description || "No description available."}
                    </p>
                  </div>

                  {/* UPDATE / DELETE BUTTONS */}
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(CATEGORY[eachData.category].update(eachData._id))
                      }
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      disabled={deletingId !== null}
                      onClick={() => handleDelete(eachData)}
                      className="flex-1 rounded-xl bg-red-500 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === eachData._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Allproduct;