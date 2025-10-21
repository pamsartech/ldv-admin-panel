import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://dev-api.payonlive.com/api/admin/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ Save token & user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        // ✅ Notify App and redirect
        onLoginSuccess();
        navigate("/user/dashboard");
        alert("Login successful!");
      } else {
        setError(response.data.message || "Login failed");
        alert("Failed to login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg w-full max-w-5xl overflow-hidden">
        {/* Left side: Logo */}
        <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-8">
          <img
            src="/icons/logo dv.svg"
            alt="La Dolce Vita Logo"
            className="w-40 h-40 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Right side: Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8 sm:p-10">
          <h2 className="text-green-800 text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
            SIGN IN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-green-800 bg-transparent py-2 text-green-800 placeholder-green-800 focus:outline-none"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-green-800 bg-transparent py-2 pr-10 text-green-800 placeholder-green-800 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 transform -translate-y-1/2 pr-2 text-green-800 focus:outline-none top-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size="lg" />
              </button>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-green-800 text-sm gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-green-800"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/user/reset-password")}
                className="hover:underline text-center sm:text-right"
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full text-white ${
                loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-900"
              } transition-colors`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
