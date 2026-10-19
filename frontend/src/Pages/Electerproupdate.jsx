import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const Electerproupdate = () => {
  const navigate = useNavigate();
  const Params = useParams();

  const [Electerupdate, setElecterupdate] = useState({
    ProductName: "",
    Brand: "",
    Imageurl: "",
    price: "",
    Discount: "0",
    Description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Product fetch karein
  async function proupdate() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.post(
        import.meta.env.VITE_Backend_base_ULR +
          "/EPcreate/EpfindoneApi",
        {
          id: Params.allfindoneid,
        },
        {
          withCredentials: true,
        }
      );

      const Updateproduct = response.data.allfindone;

      if (!Updateproduct) {
        throw new Error(
          response.data.msg || "Product nahi mila."
        );
      }

      setElecterupdate({
        ProductName: Updateproduct.ProductName || "",
        Brand: Updateproduct.Brand || "",
        Imageurl: Updateproduct.Imageurl || "",
        price: Updateproduct.price ?? "",
        Discount: Updateproduct.Discount ?? "0",
        Description: Updateproduct.Description || "",
      });
    } catch (error) {
      console.error(
        "Product fetch error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.msg ||
          error.message ||
          "Product load nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    proupdate();
  }, [Params.allfindoneid]);

  // Product update karein
  async function proupdataSumit(event) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!Electerupdate.ProductName.trim()) {
      setErrorMessage("Product name enter karein.");
      return;
    }

    if (
      Electerupdate.price === "" ||
      !Number.isFinite(Number(Electerupdate.price)) ||
      Number(Electerupdate.price) < 0
    ) {
      setErrorMessage("Valid product price enter karein.");
      return;
    }

    const discount = Number(Electerupdate.Discount || 0);

    if (discount < 0 || discount > 100) {
      setErrorMessage("Discount 0 se 100 ke darmiyan hona chahiye.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        import.meta.env.VITE_Backend_base_ULR +
          "/EPcreate/EPupdateApi",
        {
          ProductName: Electerupdate.ProductName,
          Brand: Electerupdate.Brand,
          Imageurl: Electerupdate.Imageurl,
          price: Number(Electerupdate.price),
          Discount: discount,
          Description: Electerupdate.Description,
          id: Params.allfindoneid,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Product update response:", response.data);

      if (response.data.success === true) {
        setSuccessMessage("Product successfully updated!");

        setTimeout(() => {
          navigate("/AllElecterproduct");
        }, 700);
      } else {
        setErrorMessage(
          response.data.msg || "Product update nahi ho saka."
        );
      }
    } catch (error) {
      console.error(
        "Product update error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.msg ||
          "Product update nahi hua. Backend API check karein."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-blue-950";

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white md:flex-row">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="min-w-0 w-full flex-1 px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="mx-auto mb-8 max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Shop Dashboard
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Update Electrical Product
          </h1>

          <p className="mt-2 text-gray-500">
            Apne product ki information update karein.
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={proupdataSumit}
          className="mx-auto max-w-5xl rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8"
        >
          {loading ? (
            <p className="py-10 text-center text-gray-600">
              Loading product...
            </p>
          ) : (
            <>
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >
                  {successMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* PRODUCT NAME */}
                <div>
                  <label className={labelClass}>Product Name *</label>

                  <input
                    value={Electerupdate.ProductName}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        ProductName: event.target.value,
                      })
                    }
                    type="text"
                    required
                    maxLength={150}
                    placeholder="Enter product name"
                    className={inputClass}
                  />
                </div>

                {/* BRAND */}
                <div>
                  <label className={labelClass}>Brand Name</label>

                  <input
                    value={Electerupdate.Brand}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        Brand: event.target.value,
                      })
                    }
                    type="text"
                    placeholder="Enter brand name"
                    className={inputClass}
                  />
                </div>

                {/* IMAGE URL */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Image URL</label>

                  <input
                    value={Electerupdate.Imageurl}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        Imageurl: event.target.value,
                      })
                    }
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    className={inputClass}
                  />

                  {Electerupdate.Imageurl && (
                    <img
                      src={Electerupdate.Imageurl}
                      alt="Product preview"
                      className="mt-4 h-32 w-32 rounded-xl border border-gray-200 object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>

                {/* PRICE */}
                <div>
                  <label className={labelClass}>Price (PKR) *</label>

                  <input
                    value={Electerupdate.price}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        price: event.target.value,
                      })
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="Enter product price"
                    className={inputClass}
                  />
                </div>

                {/* DISCOUNT */}
                <div>
                  <label className={labelClass}>Discount (%)</label>

                  <input
                    value={Electerupdate.Discount}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        Discount: event.target.value,
                      })
                    }
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter discount"
                    className={inputClass}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Description</label>

                  <textarea
                    value={Electerupdate.Description}
                    onChange={(event) =>
                      setElecterupdate({
                        ...Electerupdate,
                        Description: event.target.value,
                      })
                    }
                    rows={5}
                    maxLength={2000}
                    placeholder="Write product description..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/AllElecterproduct")}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update Product"}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default Electerproupdate;