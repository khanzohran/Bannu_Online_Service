
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const API = import.meta.env.VITE_Backend_base_ULR;

function Pbooking() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { findMyWorkers } = useParams();

  // Selected plumber passed from plumber listing page
  const [plumber, setPlumber] = useState(
    locationState.state?.plumber || null
  );

  const [loadingPlumber, setLoadingPlumber] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [pumberstate, setpumberstate] = useState({
    Name: "",
    usernumber: "",
    location: "",
    Problem: "",
    Date: "",
    Time: "",
    Description: "",
  });

  // Support different possible field names
  const plumberName =
    plumber?.Name ||
    plumber?.name ||
    plumber?.Yourname ||
    plumber?.YourName ||
    plumber?.FullName ||
    "Professional Plumber";

  const plumberPhone =
    plumber?.ContactNumber ||
    plumber?.PhoneNumber ||
    plumber?.phonenumber ||
    plumber?.usernumber ||
    plumber?.phone ||
    plumber?.MobileNumber ||
    plumber?.WhatsApp ||
    "";

  const plumberLocation =
    plumber?.ShopLocation ||
    plumber?.shoplocation ||
    plumber?.PhysicalShopLocation ||
    plumber?.Location ||
    plumber?.location ||
    plumber?.OurShop?.shoplocation ||
    plumber?.OurShop?.ShopLocation ||
    plumber?.OurShop?.PhysicalShopLocation ||
    "";

  const plumberImage =
    plumber?.Image ||
    plumber?.image ||
    plumber?.Imageurl ||
    plumber?.imageUrl ||
    plumber?.UserImg ||
    "";

  // Load plumber details if the listing page did not pass them
  useEffect(() => {
    let cancelled = false;

    async function getPlumber() {
      if (plumber || !findMyWorkers) return;

      setLoadingPlumber(true);

      try {
        const response = await axios.get(
          `${API}/workerroute/plumberuserApi`,
          { withCredentials: true }
        );

        const data = response.data;

        const workers = Array.isArray(data?.workers)
          ? data.workers
          : Array.isArray(data?.Electriuser)
          ? data.Electriuser
          : Array.isArray(data?.plumbers)
          ? data.plumbers
          : [];

        const selectedPlumber = workers.find(
          (worker) =>
            String(worker._id) === String(findMyWorkers)
        );

        if (!cancelled) {
          if (selectedPlumber) {
            setPlumber(selectedPlumber);
          } else {
            alert(
              "Plumber details not found. Please go back and select a plumber again."
            );
          }
        }
      } catch (error) {
        console.error("Plumber fetch error:", error);

        if (!cancelled) {
          alert("Unable to load plumber details.");
        }
      } finally {
        if (!cancelled) {
          setLoadingPlumber(false);
        }
      }
    }

    getPlumber();

    return () => {
      cancelled = true;
    };
  }, [findMyWorkers, plumber]);

  function handleChange(event) {
    const { name, value } = event.target;

    setpumberstate((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function plumbersumit(event) {
    event?.preventDefault();

    if (submitting) return;

    if (!findMyWorkers) {
      alert("Plumber ID missing. Please select a plumber again.");
      navigate("/UserAllPlumberworker");
      return;
    }

    if (!plumber) {
      alert("Plumber details are still loading. Please try again.");
      return;
    }

    if (
      !pumberstate.Name.trim() ||
      !pumberstate.usernumber.trim() ||
      !pumberstate.location.trim() ||
      !pumberstate.Problem
    ) {
      alert(
        "Please enter your name, phone number, location and plumbing problem."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        // Selected plumber details
        plumberId: findMyWorkers,
        PlumberName: plumberName,
        PlumberContactNumber: String(plumberPhone),
        PlumberShopLocation: String(plumberLocation),

        // Customer booking details
        Name: pumberstate.Name.trim(),
        usernumber: pumberstate.usernumber.trim(),
        location: pumberstate.location.trim(),
        Problem: pumberstate.Problem,
        Date: pumberstate.Date,
        Time: pumberstate.Time,
        Description: pumberstate.Description.trim(),
      };

      console.log("Plumber booking payload:", payload);

      const response = await axios.post(
        `${API}/Plumber/PbookApi`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success === true) {
        navigate("/booking", {
          state: { bookingSuccess: true },
        });
      } else {
        alert(
          response.data?.message ||
            "Plumber booking could not be created."
        );
      }
    } catch (error) {
      console.error(
        "Plumber Booking Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Bannu Online Services
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Plumber Booking
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your information to book a professional plumber.
          </p>
        </div>

        {/* SELECTED PLUMBER */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Selected Plumber
          </p>

          {loadingPlumber ? (
            <p className="mt-4 text-sm text-gray-500">
              Loading plumber details...
            </p>
          ) : (
            <div className="mt-3 flex items-center gap-4">
              {plumberImage ? (
                <img
                  src={plumberImage}
                  alt={plumberName}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-3xl">
                  🔧
                </div>
              )}

              <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-blue-950">
                  {plumberName}
                </h2>

                <p className="mt-1 break-words text-sm text-gray-600">
                  Phone: {plumberPhone || "Not provided"}
                </p>

                <p className="mt-1 break-words text-sm text-gray-600">
                  Location: {plumberLocation || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMER BOOKING FORM */}
        <form
          onSubmit={plumbersumit}
          className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold text-blue-950">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Your Name
              </label>

              <input
                name="Name"
                value={pumberstate.Name}
                onChange={handleChange}
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Phone Number (WhatsApp)
              </label>

              <input
                name="usernumber"
                value={pumberstate.usernumber}
                onChange={handleChange}
                type="tel"
                required
                placeholder="03XX XXXXXXX"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Bannu Street Address / Location
              </label>

              <input
                name="location"
                value={pumberstate.location}
                onChange={handleChange}
                type="text"
                required
                placeholder="Enter your location"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Preferred Booking Date
              </label>

              <input
                name="Date"
                value={pumberstate.Date}
                onChange={handleChange}
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* TIME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Preferred Time
              </label>

              <input
                name="Time"
                value={pumberstate.Time}
                onChange={handleChange}
                type="time"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PROBLEM */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Select Plumbing Task / Problem
              </label>

              <select
                name="Problem"
                value={pumberstate.Problem}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a plumbing problem</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Pipe Repair">Pipe Repair</option>
                <option value="Tap / Faucet Repair">
                  Tap / Faucet Repair
                </option>
                <option value="Drainage Blockage">
                  Drainage Blockage
                </option>
                <option value="Bathroom Fitting">Bathroom Fitting</option>
                <option value="Wash Basin Installation">
                  Wash Basin Installation
                </option>
                <option value="Toilet / Flush Repair">
                  Toilet / Flush Repair
                </option>
                <option value="Water Tank Installation">
                  Water Tank Installation
                </option>
                <option value="Water Motor / Pump Repair">
                  Water Motor / Pump Repair
                </option>
                <option value="New Plumbing Installation">
                  New Plumbing Installation
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

          
          </div>

          {/* BUTTONS */}
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
              type="submit"
              disabled={submitting || loadingPlumber || !plumber}
              className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Plumber"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Pbooking;
