// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import apiClient from "../apiClient";
import { Link } from 'react-router-dom'


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Adjust path if your backend prefix is different
      const res = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      const data = res.data || {};
      const { token, role } = data;

      if (!token) {
        throw new Error("No token returned from server.");
      }

      // Save auth info for later API calls
      localStorage.setItem("ch_token", token);
      localStorage.setItem("ch_user", JSON.stringify(data));

      setSuccess("Login successful! Redirecting...");
      setLoading(false);

      // Simple redirect without depending on React Router setup
      const normalizedRole = (role || "").toUpperCase();
      if (normalizedRole === "ADMIN") {
        window.location.href = "/admin";
      } else {
        // both STUDENT and FACULTY land on feed; UI will differ by role
        window.location.href = "/feed";
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);

      // Try to show a helpful message from backend if available
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      if (
        backendMsg &&
        backendMsg.toLowerCase().includes("email not verified")
      ) {
        setError("Email not verified. Please complete OTP verification first.");
      } else if (
        backendMsg &&
        backendMsg.toLowerCase().includes("bad credentials")
      ) {
        setError("Invalid email or password.");
      } else {
        setError(backendMsg || "Login failed. Please try again.");
      }
    }
  };

  return (
        <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #111827 100%), url('https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full bg-white/80 backdrop-blur shadow-xl rounded-2xl border border-indigo-100 p-8">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-md">
              C
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Connect<span className="text-indigo-600">Here</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Welcome back! Log in to your campus space.
          </p>
        </div>

        {/* Error / success messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            {/* You can hook this up later */}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-4">
  New to ConnectHere?{' '}
  <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
    Register
  </Link>{' '}
</p>

      </div>
    </div>

  );
};

export default LoginPage;
