import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

const Allplumberproduct = () => {
  const navigate = useNavigate();

  const [Plumbingproduct, setPlumbingproduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const API = import.meta.env.VITE_Backend_base_ULR;

  // ================= FETCH MY PLUMBING PRODUCTS =================
  const Allplumbingproductsumit = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API}/PPcreate/MyPpfindApi`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success === false) {
        throw new Error(
          response.data.msg || "Plumbing products fetch nahi ho sake."
        );
      }

      setPlumbingproduct(
        Array.isArray(response.data.findobj)
          ? response.data.findobj
          : []
      );
    } catch (error) {
      console.error(
        "Plumbing Product Fetch Error:",
        error.response?.data || error.message
      );

      setPlumbingproduct([]);

      setErrorMessage(
        error.response?.data?.msg ||
          error.message ||
          "Plumbing products load nahi ho sake. Login aur backend API check karein."
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
    const confirmDelete = window.confirm(
      "Kya aap waqai is plumbing product ko delete karna chahte hain?"
    );

    if (!confirmDelete || deletingId) return;

    try {
      setDeletingId(productId);
      setErrorMessage("");

      const response = await axios.post(
        `${API}/PPcreate/PPdelateApi`,
        {
          id: productId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success === true) {
        setPlumbingproduct((previous) =>
          previous.filter((product) => product._id !== productId)
        );
      } else {
        setErrorMessage(
          response.data.msg || "Product delete nahi ho saka."
        );
      }
    } catch (error) {
      console.error(
        "Plumbing Product Delete Error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.msg ||
          "Product delete nahi hua. Backend API check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= PAGE UI =================
  return (
    <div className="flex min-h-screen bg-slate-100">
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
                Yahan sirf aapki apni shop ke plumbing products show honge.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/AdminPproductcreate")}
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 whitespace-nowrap"
            >
              + Add New Product
            </button>
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
              className="rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Retry"}
            </button>
          </div>
        )}

        {/* TAB BUTTONS (All / Electrical / Plumbing) */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/shoponwerallproduct")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400"
          >
            All
          </button>

          <button
            type="button"
            onClick={() => navigate("/AllElecterproduct")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400"
          >
            Electrical
          </button>

          <button
            type="button"
            className="rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition"
          >
            Plumbing
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
              {Plumbingproduct.length}
            </span>
          </button>
        </div>

        {/* LOADING STATE */}
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
              className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Create Your First Product
            </button>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Plumbingproduct.map((eachData) => (
              <div
                key={eachData._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="flex h-52 items-center justify-center overflow-hidden bg-slate-100">
                  {eachData.Imageurl ? (
                    <img
                      src={eachData.Imageurl}
                      alt={eachData.ProductName || "Plumbing product"}
                      className="h-full w-full object-contain p-3"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      No product image
                    </span>
                  )}
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

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Brand
                      </p>
                      <p className="font-semibold text-slate-700 truncate">
                        {eachData.Brand || "No brand"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Stock
                      </p>
                      <p className="font-semibold text-slate-700">
                        {eachData.stock ?? 0}
                      </p>
                    </div>
                  </div>

                  {(eachData.size || eachData.color) && (
                    <div className="mt-2 flex gap-4 text-xs text-slate-500">
                      {eachData.size && <span>Size: {eachData.size}</span>}
                      {eachData.color && <span>Color: {eachData.color}</span>}
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Description
                    </p>
                    <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-slate-600">
                      {eachData.Description || "No description available."}
                    </p>
                  </div>

                  {/* UPDATE / DELETE BUTTONS */}
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
                      disabled={deletingId === eachData._id || deletingId !== null}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Allplumberproduct;