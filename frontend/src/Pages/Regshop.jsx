
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Regshop = () => {
  const navigate = useNavigate();

  const [sellerstate, setsellerstate] = useState({
    Yourname: "",
    Shopname: "",
    phonenumber: "",
    Cnicnumber: "",
    shoplocation: "",
  });

  const [UserImg, setUserImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setsellerstate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function sellersumit(event) {
    event.preventDefault();
    setError("");

    if (!UserImg) {
      setError("Please select a profile photo.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(sellerstate).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("UserImg", UserImg);

      const response = await axios.post(
        import.meta.env.VITE_Backend_base_ULR +
          "/sellerroute/sellercreateApi",
        formData
      );

      if (response.data.success === true) {
        navigate("/onlineshopowerdashbord");
      } else {
        setError(response.data.msg || "Seller registration failed.");
      }
    } catch (err) {
      console.error("Seller registration error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Registration failed. Check your backend terminal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-100/40">

        <div className="bg-blue-950 px-5 py-5 text-center">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Seller Registration
          </h1>
          <p className="mt-1 text-xs text-blue-200">
            Bannu Online Services
          </p>
          <p className="mt-1 text-xs text-blue-100">
            Enter your details to register your shop
          </p>
        </div>

        <form onSubmit={sellersumit} className="space-y-3 p-5 sm:p-7">

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              Your Name *
            </label>
            <input
              name="Yourname"
              value={sellerstate.Yourname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              Shop Name *
            </label>
            <input
              name="Shopname"
              value={sellerstate.Shopname}
              onChange={handleChange}
              placeholder="Enter your shop name"
              required
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phonenumber"
              value={sellerstate.phonenumber}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              pattern="03[0-9]{9}"
              maxLength={11}
              required
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              CNIC Number *
            </label>
            <input
              type="text"
              name="Cnicnumber"
              value={sellerstate.Cnicnumber}
              onChange={handleChange}
              placeholder="XXXXX-XXXXXXX-X"
              pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
              maxLength={15}
              required
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              Physical Shop Location *
            </label>
            <input
              name="shoplocation"
              value={sellerstate.shoplocation}
              onChange={handleChange}
              placeholder="Enter your complete shop address"
              required
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-950">
              Profile Photo *
            </label>
            <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-3">
              <input
                type="file"
                name="UserImg"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  setUserImg(event.target.files?.[0] || null)
                }
                required
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-950 file:px-3 file:py-2 file:font-semibold file:text-white"
              />
              <p className="mt-2 text-xs text-slate-500">
                PNG, JPG or WEBP · Max 5MB
              </p>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register as Shop"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Please make sure all information is correct.
          </p>

        </form>
      </div>
    </div>
  );
};

export default Regshop;
