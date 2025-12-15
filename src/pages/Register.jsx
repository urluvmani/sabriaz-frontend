// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.password) {
      return setError("Name aur password required hain.");
    }

    if (!formData.email) {
      return setError("Email bhi fill karein (unique honi chahiye).");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Password aur Confirm Password match nahi kar rahe.");
    }

    try {
      setLoading(true);

      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      // Backend: router.post("/register", register);
      const { data } = await axios.post(
        "https://sabriaz-backend.onrender.com/api/auth/register",
        body
      );

      // Optional: token/user ko localStorage mein save karna
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Account successfully create ho gaya ✅");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Kuch ghalti ho gai, dobara koshish karein.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      {/* Outer Container */}
      <div className="max-w-md w-full bg-white text-black rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
        {/* Top Bar */}
        <div className="border-b border-neutral-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide uppercase">
              Create Account
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Join our store and track your orders easily.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full border border-black flex items-center justify-center text-xs font-semibold">
            DJ
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Error / Success */}
          {error && (
            <div className="text-xs bg-black text-white px-3 py-2 rounded-md border border-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs bg-white text-black px-3 py-2 rounded-md border border-green-500">
              {success}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wide uppercase">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Muhammad Ali"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wide uppercase">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wide uppercase">
              Phone (optional)
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+92xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wide uppercase">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wide uppercase">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-black text-white text-sm font-semibold tracking-wide py-2.5 rounded-md border border-black disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="text-xs uppercase tracking-[0.2em]">
                Creating...
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.25em]">
                Create Account
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-neutral-300" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
              or
            </span>
            <span className="h-px flex-1 bg-neutral-300" />
          </div>

          {/* Login Link */}
          <p className="text-[11px] text-neutral-600 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 decoration-black font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Footer */}
        <div className="px-8 py-3 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
          <span>© {new Date().getFullYear()} Your Brand</span>
          <span className="uppercase tracking-[0.2em]">Black &amp; White</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
