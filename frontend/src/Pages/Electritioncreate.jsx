
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const initialState = {
  Name: "",
  Image: null,
  ContactNumber: "",
  Description: "",
  BelongsToShop: "",
  ShopLocation: "",
};

const Electritioncreate = () => {
  const navigate = useNavigate();

  const [electriwor, setelectriwor] = useState(initialState);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Image preview URL cleanup
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle text inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setelectriwor((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      setelectriwor((prev) => ({
        ...prev,
        Image: null,
      }));

      setPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setPreview((oldPreview) => {
      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
      }

      return URL.createObjectURL(file);
    });

    setelectriwor((prev) => ({
      ...prev,
      Image: file,
    }));
  };

  // Create Electrician
  const electriworsumit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!API) {
      setErrorMessage(
        "Backend API URL .env file mein set nahi hai."
      );
      return;
    }

    if (
      !electriwor.Name.trim() ||
      !electriwor.ContactNumber.trim() ||
      !electriwor.BelongsToShop.trim() ||
      !electriwor.ShopLocation.trim()
    )

    if (!electriwor.Image) {
      setErrorMessage("Electrician ki image select karo.");
      return;
    }

    const formData = new FormData();

    formData.append("Name", electriwor.Name.trim());
    formData.append("Image", electriwor.Image);
    formData.append(
      "ContactNumber",
      electriwor.ContactNumber.trim()
    );
    formData.append(
      "Description",
      electriwor.Description.trim()
    );
    formData.append(
      "BelongsToShop",
      electriwor.BelongsToShop.trim()
    );
    formData.append(
      "ShopLocation",
      electriwor.ShopLocation.trim()
    );

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/workerroute/ElectritionCreateApi`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (
        response.data?.success === true &&
        response.data?.worker?._id
      ) {
        setSuccessMessage("Electrician successfully created!");

        navigate("/AllElectricianworker", {
          replace: true,
        });

        return;
      }

      throw new Error(
        response.data?.message ||
          "Electrician create nahi ho saka."
      );
    } catch (error) {
      console.error(
        "Electrician Create Error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        setErrorMessage(
          "Login session expire ho gaya hai. Dobara Shop account se login karo."
        );
      } else if (error.response?.status === 403) {
        setErrorMessage(
          "Aap ko Electrician create karne ki permission nahi hai."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Electrician create nahi ho saka."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:h-screen lg:w-72">
          <AdminSidebar />
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                Bannu Online Services
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Create Electrician
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Add electrician details, shop information and profile image.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={electriworsumit}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div
                  role="status"
                  className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {successMessage}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label
                  htmlFor="Image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Electrician Image *
                </label>

                <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Electrician preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">👨‍🔧</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      Select profile photo
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP. Maximum 5 MB.
                    </p>

                    <input
                      id="Image"
                      name="Image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required
                      disabled={loading}
                      onChange={handleImageChange}
                      className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />

                    {electriwor.Image && (
                      <p className="mt-2 break-all text-xs text-green-700">
                        Selected: {electriwor.Image.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Electrician Name and Contact */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="Name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Electrician Name *
                  </label>

                  <input
                    id="Name"
                    name="Name"
                    type="text"
                    value={electriwor.Name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    maxLength={100}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ContactNumber"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Contact Number *
                  </label>

                  <input
                    id="ContactNumber"
                    name="ContactNumber"
                    type="tel"
                    value={electriwor.ContactNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    maxLength={20}
                    placeholder="03XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

             
              <div>
                    <label
                      htmlFor="ShopLocation"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Shop Location *
                    </label>

                    <input
                      id="ShopLocation"
                      name="ShopLocation"
                      type="text"
                      value={electriwor.ShopLocation}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      maxLength={200}
                      placeholder="e.g. Bannu Railway Road"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                    />
                  </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="Description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="Description"
                  name="Description"
                  rows={4}
                  value={electriwor.Description}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={1000}
                  placeholder="Skills and experience..."
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/AllElectricianworker")}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}

                  {loading
                    ? "Uploading image..."
                    : "Create Electrician"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Electritioncreate;
