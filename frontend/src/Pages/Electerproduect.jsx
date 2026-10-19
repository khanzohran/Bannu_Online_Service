import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";

function ElectricalProduct() {
  const navigate = useNavigate();

  const [Electerproduct, setElecterproduct] = useState({
    ProductName: "",
    Brand: "",
    price: "",
    Discount: "0",
    Description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Input fields
  function handleChange(event) {
    const { name, value } = event.target;

    setElecterproduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Image select and preview
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please image file select karein.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image ka size 5 MB se kam hona chahiye.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // Release preview URL when it changes or component unmounts
  useEffect(() => {
    if (!imagePreview) return;

    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Create product
  async function ProductSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!Electerproduct.ProductName.trim()) {
      setErrorMessage("Product name enter karein.");
      return;
    }

    if (
      Electerproduct.price === "" ||
      !Number.isFinite(Number(Electerproduct.price)) ||
      Number(Electerproduct.price) < 0
    ) {
      setErrorMessage("Valid product price enter karein.");
      return;
    }

    if (
      Electerproduct.Discount !== "" &&
      (!Number.isFinite(Number(Electerproduct.Discount)) ||
        Number(Electerproduct.Discount) < 0 ||
        Number(Electerproduct.Discount) > 100)
    ) {
      setErrorMessage("Discount 0 se 100 ke darmiyan hona chahiye.");
      return;
    }

    if (!imageFile) {
      setErrorMessage("Product ki image select karein.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("ProductName", Electerproduct.ProductName.trim());
      formData.append("Brand", Electerproduct.Brand.trim());
      formData.append("price", String(Number(Electerproduct.price)));
      formData.append(
        "Discount",
        String(Number(Electerproduct.Discount || 0))
      );
      formData.append("Description", Electerproduct.Description.trim());

      // Backend mein upload.single("image") hona chahiye
      formData.append("image", imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_base_ULR}/EPcreate/EPcreateApi`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success === true) {
        setSuccessMessage("Electrical product successfully created!");

        setElecterproduct({
          ProductName: "",
          Brand: "",
          price: "",
          Discount: "0",
          Description: "",
        });

        setImageFile(null);
        setImagePreview("");

        const fileInput = document.getElementById("product-image");
        if (fileInput) fileInput.value = "";

        setTimeout(() => {
          navigate("/AllElecterproduct");
        }, 700);
      } else {
        setErrorMessage(
          response.data.msg || "Product create nahi ho saka."
        );
      }
    } catch (error) {
      console.error(
        "Product create error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.msg ||
          "Product create nahi hua. Backend, login aur Cloudinary settings check karein."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-semibold text-blue-950";

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white md:flex-row">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-w-0 w-full flex-1 px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="mx-auto mb-8 max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Shop Dashboard
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Electrical Product Create
          </h1>

          <p className="mt-2 text-gray-500">
            Apni shop ke liye naya electrical product add karein.
          </p>
        </div>

        {/* PRODUCT FORM */}
        <form
          onSubmit={ProductSubmit}
          className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* PRODUCT NAME */}
            <div>
              <label className={labelClass}>Product Name *</label>

              <input
                name="ProductName"
                value={Electerproduct.ProductName}
                onChange={handleChange}
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
                name="Brand"
                value={Electerproduct.Brand}
                onChange={handleChange}
                type="text"
                placeholder="Enter brand name"
                className={inputClass}
              />
            </div>

            {/* SIMPLE IMAGE INPUT */}
            <div className="md:col-span-2">
              <label htmlFor="product-image" className={labelClass}>
                Product Image *
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP ya GIF. Maximum 5 MB.
              </p>

              {imagePreview && (
                <div className="mt-3">
                  <p className="mb-2 text-sm text-gray-600">Image Preview</p>

                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-28 w-28 rounded-lg border border-gray-200 bg-white object-contain"
                  />
                </div>
              )}
            </div>

            {/* PRICE */}
            <div>
              <label className={labelClass}>Price (PKR) *</label>

              <input
                name="price"
                value={Electerproduct.price}
                onChange={handleChange}
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="Enter product price"
                className={inputClass}
              />
            </div>

            {/* DISCOUNT */}
            <div>
              <label className={labelClass}>Discount (%)</label>

              <input
                name="Discount"
                value={Electerproduct.Discount}
                onChange={handleChange}
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
                name="Description"
                value={Electerproduct.Description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                placeholder="Write product description..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Uploading Image..." : "Create Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ElectricalProduct;