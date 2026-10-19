import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Registration() {
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_Backend_base_ULR;

  const [signstate, setsignstate] = useState({
    Name: "",
    Email: "",
    password: "",
    Role: "",
    AccessCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  // Page khulte hi check karo ke Admin pehle se bana hai ya nahi
  useEffect(() => {
    axios
      .get(BASE + "/Login/AdminExists")
      .then((res) => setAdminExists(res.data.adminExists))
      .catch(() => {});
  }, []);

  // Sirf Shop ke liye apna code chahiye (Admin ke liye nahi)
  const needsCode = signstate.Role === "Shop";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100";

  async function sumit() {
    setError("");

    if (!signstate.Name || !signstate.Email || !signstate.password || !signstate.Role) {
      setError("Sab fields bharna zaroori hai.");
      return;
    }
    if (needsCode && signstate.AccessCode.length < 6) {
      setError("Shop code kam az kam 6 characters ka rakho.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(BASE + "/Login/SignApi", signstate, {
        withCredentials: true,
      });

     
if (response.data.success === true) {
  if (signstate.Role === "User") {
    navigate("/Home");
  } else if (signstate.Role === "Shop") {
    navigate("/shopregfram");
  } else if (signstate.Role === "admin") {
    navigate("/AdminSidebar");
  }
} else {
  setError(response.data.msg || "Signup nahi hua.");
}

    } catch (err) {
      setError(err.response?.data?.msg || "Server error, dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md">
        {/* CROSS BUTTON */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-600 shadow-lg transition hover:bg-blue-700 hover:text-white"
        >
          ✕
        </button>

        {/* REGISTRATION CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-blue-100/60 sm:p-9">
          {/* HEADING */}
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Create Account
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Register Now</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create your account to access our services.
            </p>
          </div>

          {/* NAME */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Full Name</label>
            <input
              onChange={(e) => setsignstate({ ...signstate, Name: e.target.value })}
              type="text"
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Email Address</label>
            <input
              onChange={(e) => setsignstate({ ...signstate, Email: e.target.value })}
              type="email"
              placeholder="Enter your email"
              className={inputClass}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Password</label>
            <input
              onChange={(e) => setsignstate({ ...signstate, password: e.target.value })}
              type="password"
              placeholder="Create a password"
              className={inputClass}
            />
          </div>

          {/* ROLE */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Select Role</label>
            <select
              onChange={(e) =>
                setsignstate({ ...signstate, Role: e.target.value, AccessCode: "" })
              }
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>Select your role</option>
              <option value="User">User</option>
              <option value="admin" disabled={adminExists}>
                {adminExists ? "Admin (already taken)" : "Admin"}
              </option>
              <option value="Shop">Shop</option>
            </select>

            {/* Admin ke liye info */}
            {signstate.Role === "admin" && (
              <p className="mt-2 text-xs text-slate-400">
                Pehla Admin signup hi website ka Admin hoga.
              </p>
            )}
          </div>

          {/* SHOP CODE (sirf Shop ke liye) */}
          {needsCode && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-800">
                Apna Shop Code banao
              </label>
              <input
                value={signstate.AccessCode}
                onChange={(e) => setsignstate({ ...signstate, AccessCode: e.target.value })}
                type="password"
                placeholder="Kam az kam 6 characters"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-slate-400">
                Ye code yaad rakho. Shop login par ye zaroori hoga.
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {/* REGISTER BUTTON */}
          <button
            onClick={sumit}
            type="button"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Create Account →"}
          </button>

          {/* LOGIN */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?
            <button
              onClick={() => navigate("/")}
              type="button"
              className="ml-1 font-bold text-blue-600 hover:text-blue-800"
            >
              Login
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 Bannu Online Services. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Registration;