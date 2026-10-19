import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_Backend_base_ULR;

  const [form, setForm] = useState({
    Email: "",
    password: "",
    Role: "",
    AccessCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100";

  async function submit() {
    setError("");

    if (!form.Email || !form.password || !form.Role) {
      setError("Email, password aur role zaroori hain.");
      return;
    }
    if (form.Role === "Shop" && !form.AccessCode) {
      setError("Shop code likhna zaroori hai.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(BASE + "/Login/loginApi", form, {
        withCredentials: true,
      });

      if (response.data.success === true) {
        // Role backend ne bheja hai, usi se page khulega
        const role = response.data.Role;
        if (role === "admin") navigate("/Admindashbord");
        else if (role === "Shop") navigate("/onlineshopowerdashbord");
        else navigate("/Home");
      } else {
        setError(response.data.msg || "Login nahi hua.");
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
        <button
          type="button"
         onClick={() => navigate("/Home")}
          className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-600 shadow-lg transition hover:bg-blue-700 hover:text-white"
        >
          ✕
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-blue-100/60 sm:p-9">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Welcome Back
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Login</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to your Bannu Online Services account.
            </p>
          </div>

          {/* ROLE */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Select Role</label>
            <select
              defaultValue=""
              onChange={(e) => setForm({ ...form, Role: e.target.value, AccessCode: "" })}
              className={inputClass}
            >
              <option value="" disabled>Select your role</option>
              <option value="User">User</option>
              <option value="admin">Admin</option>
              <option value="Shop">Shop</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-800">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* SHOP CODE (sirf Shop ke liye) */}
          {form.Role === "Shop" && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-800">Shop Code</label>
              <input
                type="password"
                value={form.AccessCode}
                placeholder="Apna Shop code likho"
                onChange={(e) => setForm({ ...form, AccessCode: e.target.value })}
                className={inputClass}
              />
            </div>
          )}

          {error && (
            <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            type="button"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Login →"}
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            Naya account banana hai?
            <button
              onClick={() => navigate("/SiginUp")}
              type="button"
              className="ml-1 font-bold text-blue-600 hover:text-blue-800"
            >
              Register
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

export default Login;