
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_Backend_base_ULR;

function Electrician() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { id } = useParams();

  // Selected electrician from Userelectri page
  const electrician = locationState.state?.electrician;

  const [electerstate, setelecterstate] = useState({
    Name: "",
    usernumber: "",
    location: "",
    Problem: "",
    Date: "",
    Description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setelecterstate((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function Electersumit() {
    if (submitting) return;

    if (!id) {
      navigate("/Userelectri");
      return;
    }

    if (
      !electerstate.Name.trim() ||
      !electerstate.usernumber.trim() ||
      !electerstate.location.trim() ||
      !electerstate.Problem
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        // Selected electrician details
        electricianId: id,
        ElectricianName: electrician?.Name || "",
        ElectricianContactNumber: electrician?.ContactNumber || "",
        ElectricianShopLocation:
          electrician?.ShopLocation ||
          electrician?.OurShop?.shoplocation ||
          electrician?.OurShop?.ShopLocation ||
          electrician?.OurShop?.PhysicalShopLocation ||
          "",

        // Customer booking details
        Name: electerstate.Name.trim(),
        usernumber: electerstate.usernumber.trim(),
        location: electerstate.location.trim(),
        Problem: electerstate.Problem,
        Date: electerstate.Date,
        Description: electerstate.Description.trim(),
      };

      const response = await axios.post(
        `${API}/Electer/EbookApi`,
        payload
      );

      if (response.data?.success === true) {
        navigate("/booking", {
          state: { bookingSuccess: true },
        });
      } else {
      }
    } catch (error) {
      console.error("Electrician Booking Error:", error);

    
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Bannu Online Services
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Electrician Booking
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your information to book an electrician.
          </p>
        </div>

        {/* Selected Electrician */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Selected Electrician
          </p>

          <div className="mt-3 flex items-center gap-4">
            {electrician?.Image ? (
              <img
                src={electrician.Image}
                alt={electrician.Name || "Electrician"}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100 text-3xl">
                ⚡
              </div>
            )}

            <div className="min-w-0">
              <h2 className="break-words text-lg font-bold text-blue-950">
                {electrician?.Name || "Electrician"}
              </h2>

              <p className="mt-1 break-words text-sm text-gray-600">
                Phone: {electrician?.ContactNumber || "Not provided"}
              </p>

             
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-blue-950">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Your Name
              </label>

              <input
                name="Name"
                value={electerstate.Name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Phone Number (WhatsApp)
              </label>

              <input
                name="usernumber"
                value={electerstate.usernumber}
                onChange={handleChange}
                type="tel"
                placeholder="03XX XXXXXXX"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Bannu Street Address / Location
              </label>

              <input
                name="location"
                value={electerstate.location}
                onChange={handleChange}
                type="text"
                placeholder="Enter your location"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Preferred Booking Date
              </label>

              <input
                name="Date"
                value={electerstate.Date}
                onChange={handleChange}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Problem */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Select Specific Task / Problem
              </label>

              <select
                name="Problem"
                value={electerstate.Problem}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a problem</option>
                <option value="Fan Repair">Fan Repair</option>
                <option value="Switch / Socket Repair">
                  Switch / Socket Repair
                </option>
                <option value="Light Installation">Light Installation</option>
                <option value="Wiring Problem">Wiring Problem</option>
                <option value="Breaker / Fuse Problem">
                  Breaker / Fuse Problem
                </option>
                <option value="AC Electrical Work">AC Electrical Work</option>
                <option value="New Electrical Installation">
                  New Electrical Installation
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

           
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="rounded-xl border border-blue-200 px-6 py-3 font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={Electersumit}
              disabled={submitting}
              className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Electrician"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Electrician;
