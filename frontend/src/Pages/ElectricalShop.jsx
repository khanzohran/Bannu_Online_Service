
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const ElectricalShop = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ElecterproductShop, setElecterproductShop] = useState([]);
  const [loading, setLoading] = useState(true);

  // Order Success Message
  const [orderMessage, setOrderMessage] = useState(
    location.state?.orderSuccess
      ? "Your order has been placed successfully. Our team will contact you soon."
      : ""
  );

  async function ElecterShopsumit() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_Backend_base_ULR +
          "/EPcreate/EpfindApi"
      );

      setElecterproductShop(response.data.findobj || []);
    } catch (error) {
      console.log("Product Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ElecterShopsumit();
  }, []);

  // Clear navigation state after showing the success message
  useEffect(() => {
    if (location.state?.orderSuccess) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 sm:px-8 py-6">

        {/* ORDER SUCCESS MESSAGE */}
        {orderMessage && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-xl shadow-sm flex justify-between items-center gap-4">

              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>

                <div>
                  <h2 className="font-bold text-lg">
                    Order Successfully Placed!
                  </h2>

                  <p className="text-sm mt-1">
                    {orderMessage}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOrderMessage("")}
                className="text-green-800 font-bold text-2xl hover:text-green-950"
                aria-label="Close success message"
              >
                ×
              </button>

            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="max-w-7xl mx-auto mb-6">
          <button
            onClick={() => navigate("/Shop")}
            className="bg-blue-800 hover:bg-blue-950 text-white px-5 py-2 rounded-lg font-medium transition duration-300"
          >
            ← Back
          </button>
        </div>

        {/* HEADING */}
        <div className="max-w-7xl mx-auto mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
            Online Electrical Shop
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Browse our electrical products
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto"></div>

              <p className="text-blue-800 mt-4 font-medium">
                Loading Products...
              </p>
            </div>
          </div>
        )}

        {/* EMPTY PRODUCTS */}
        {!loading && ElecterproductShop.length === 0 && (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-950">
                No Products Available
              </h2>

              <p className="text-gray-500 mt-2">
                Electrical products will appear here.
              </p>
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && ElecterproductShop.length > 0 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {ElecterproductShop.map((eachData) => (
              <div
                key={eachData._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col"
              >

                {/* PRODUCT IMAGE */}
                <div className="h-44 bg-gray-50 p-4 flex items-center justify-center">
                  <img
                    src={eachData.Imageurl}
                    alt={eachData.ProductName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-blue-950 line-clamp-1">
                    {eachData.ProductName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    Brand:{" "}
                    <span className="text-blue-800 font-semibold">
                      {eachData.Brand || "Not Specified"}
                    </span>
                  </p>

                  <p className="text-xl font-bold text-blue-800 mt-3">
                    Rs. {eachData.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
                    {eachData.Description}
                  </p>

                  {/* BUY NOW */}
                  <button
                    onClick={() =>
                      navigate(`/ElectericalOrder/${eachData._id}`)
                    }
                    className="w-full mt-auto pt-3"
                  >
                    <span className="block w-full bg-blue-800 hover:bg-blue-950 text-white py-2.5 rounded-lg font-semibold transition duration-300">
                      Buy Now →
                    </span>
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B1426] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
                B
              </div>

              <div>
                <h3 className="font-bold">
                  Bannu Online Services
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Plumbing & Electrical
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              A convenient platform for plumbing,
              electrical services and hardware products in Bannu.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-bold">Quick Links</h3>

            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <Link className="block transition hover:text-white" to="/">
                Home
              </Link>

              <Link className="block transition hover:text-white" to="/booking">
                Booking
              </Link>

              <Link className="block transition hover:text-white" to="/shop">
                Shop
              </Link>

              <Link className="block transition hover:text-white" to="/about">
                About Us
              </Link>

              <Link className="block transition hover:text-white" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="font-bold">Our Services</h3>

            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <p>Plumber Booking</p>
              <p>Electrician Booking</p>
              <p>Plumbing Products</p>
              <p>Electrical Products</p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-bold">Contact Information</h3>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
              <p>📍 Railway Road, Bannu</p>
              <p>Plumbing & Electrical Services</p>
              <p>Online Customer Support</p>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 text-xs text-slate-500 sm:px-8 md:flex-row">
            <p>
              © 2026 Bannu Online Services. All rights reserved.
            </p>

            <p>Designed for Bannu, Pakistan.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ElectricalShop;
