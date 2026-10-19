
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

const Allplumberproduct = () => {
  const navigate = useNavigate();

  const [Plumbingproduct, setPlumbingproduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  const API = import.meta.env.VITE_Backend_base_ULR;

  // ================= FETCH MY PLUMBING PRODUCTS =================
  const Allplumbingproductsumit = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!API) {
        throw new Error(
          "Backend URL missing hai. Apni .env file check karein."
        );
      }

      const response = await axios.get(
        `${API}/PPcreate/MyPpfindApi`,
        {
          withCredentials: true,
        }
      );

      console.log("Plumbing Products API Response:", response.data);

      const data = response.data;

      if (data?.success === false) {
        throw new Error(
          data.msg || data.message || "Products fetch nahi ho sake."
        );
      }

      // Different API response formats handle karega
      let products = [];

      if (Array.isArray(data)) {
        products = data;
      } else if (Array.isArray(data?.findobj)) {
        products = data.findobj;
      } else if (Array.isArray(data?.products)) {
        products = data.products;
      } else if (Array.isArray(data?.data)) {
        products = data.data;
      } else if (Array.isArray(data?.result)) {
        products = data.result;
      } else if (Array.isArray(data?.data?.findobj)) {
        products = data.data.findobj;
      } else if (Array.isArray(data?.data?.products)) {
        products = data.data.products;
      }

      setPlumbingproduct(products);
    } catch (error) {
      console.error(
        "Plumbing Product Fetch Error:",
        error.response?.data || error.message
      );

      setPlumbingproduct([]);

      setErrorMessage(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          error.message ||
          "Plumbing products load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    Allplumbingproductsumit();
  }, [Allplumbingproductsumit]);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (productId) => {
    if (!productId || deletingId) return;

    const confirmDelete = window.confirm(
      "Kya aap waqai is plumbing product ko delete karna chahte hain?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(productId);
      setErrorMessage("");

      const response = await axios.post(
        `${API}/PPcreate/PPdelateApi`,
        { id: productId },
        { withCredentials: true }
      );

      console.log("Delete Product Response:", response.data);

      if (
        response.data?.success === true ||
        response.data?.success === "true"
      ) {
        setPlumbingproduct((previous) =>
          previous.filter((product) => product._id !== productId)
        );
      } else {
        setErrorMessage(
          response.data?.msg ||
            response.data?.message ||
            "Product delete nahi ho saka."
        );
      }
    } catch (error) {
      console.error(
        "Plumbing Product Delete Error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Product delete nahi hua. Backend API check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= SEARCH PRODUCTS =================
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return Plumbingproduct;

    return Plumbingproduct.filter((product) => {
      const productName = String(product.ProductName || "").toLowerCase();
      const brand = String(product.Brand || "").toLowerCase();
      const description = String(product.Description || "").toLowerCase();

      return (
        productName.includes(searchText) ||
        brand.includes(searchText) ||
        description.includes(searchText)
      );
    });
  }, [Plumbingproduct, search]);

  // ================= PRODUCT IMAGE =================
  const getImageUrl = (product) => {
    const image =
      product?.Imageurl ||
      product?.imageUrl ||
      product?.image ||
      product?.Image ||
      "";

    if (typeof image === "string") return image;

    if (image && typeof image === "object") {
      return image.url || image.secure_url || "";
    }

    return "";
  };

  // ================= PAGE UI =================
  return (
      <div className="flex min-h-dvh w-full flex-col bg-slate-100 md:flex-row">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-5 md:p-8">
        {/* HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Shop Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl">
                My Plumbing Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Yahan aapki shop ke plumbing products show honge.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/AdminPproductcreate")}
              className="whitespace-nowrap rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              + Add New Product
            </button>
          </div>

          {/* SEARCH */}
          <div className="mt-5">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product name, brand..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="break-words text-sm">{errorMessage}</p>

            <button
              type="button"
              onClick={Allplumbingproductsumit}
              disabled={loading}
              className="shrink-0 rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Retry"}
            </button>
          </div>
        )}

        {/* CATEGORY TABS */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/shoponwerallproduct")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-700"
          >
            All
          </button>

          <button
            type="button"
            onClick={() => navigate("/AllElecterproduct")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-700"
          >
            Electrical
          </button>

          <button
            type="button"
            className="rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Plumbing
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {Plumbingproduct.length}
            </span>
          </button>
        </div>

        {/* PRODUCT COUNT */}
        {!loading && Plumbingproduct.length > 0 && (
          <p className="mb-4 text-sm text-slate-500">
            Showing {filteredProducts.length} of {Plumbingproduct.length} products
          </p>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="font-medium text-slate-600">
              Loading your plumbing products...
            </p>
          </div>
        ) : Plumbingproduct.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mb-4 text-5xl">🔧</div>

            <h2 className="text-xl font-bold text-slate-700">
              No Plumbing Products Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Abhi aapki shop mein koi plumbing product nahi hai.
            </p>

            <button
              type="button"
              onClick={() => navigate("/AdminPproductcreate")}
              className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Create Your First Product
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* NO SEARCH RESULTS */
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-700">
              No Matching Products
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search ka naam ya brand check karein.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((eachData) => {
              const imageUrl = getImageUrl(eachData);

              return (
                <div
                  key={eachData._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="flex h-52 items-center justify-center overflow-hidden bg-slate-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={eachData.ProductName || "Plumbing product"}
                        className="h-full w-full object-contain p-3"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          const fallback =
                            event.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.classList.remove("hidden");
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className={`flex h-full w-full flex-col items-center justify-center text-slate-400 ${
                        imageUrl ? "hidden" : ""
                      }`}
                    >
                      <span className="text-4xl">🔧</span>
                      <span className="mt-2 text-sm">No product image</span>
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
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

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Brand
                        </p>

                        <p className="truncate font-semibold text-slate-700">
                          {eachData.Brand || "No brand"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Stock
                        </p>

                        <p className="font-semibold text-slate-700">
                          {eachData.stock ?? "Not specified"}
                        </p>
                      </div>
                    </div>

                    {(eachData.size || eachData.color) && (
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        {eachData.size && (
                          <span>Size: {eachData.size}</span>
                        )}

                        {eachData.color && (
                          <span>Color: {eachData.color}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Description
                      </p>

                      <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-slate-600">
                        {eachData.Description || "No description available."}
                      </p>
                    </div>

                    {/* UPDATE / DELETE */}
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/plumbproupdate/${eachData._id}`)
                        }
                        className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId === eachData._id ||
                          deletingId !== null
                        }
                        onClick={() => handleDelete(eachData._id)}
                        className="flex-1 rounded-xl bg-red-500 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === eachData._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Allplumberproduct;
