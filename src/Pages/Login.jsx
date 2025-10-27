import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://la-dolce-vita.onrender.com/api/admin/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/user/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
          "Invalid credentials or server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7ef]">
      <div className="flex flex-col md:flex-row bg-[#fffaf0] rounded-2xl shadow-md overflow-hidden w-full max-w-4xl border border-gray-200">
        {/* Left: Logo Section */}
        <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-10">
          <div className="w-64 h-64 rounded-full flex items-center justify-center bg-[#fffaf0]">
            <img
              src="/icons/logo dv.svg"
              alt="La Dolce Vita Logo"
              className="w-56 h-56 object-contain"
            />
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 space-y-6">
          <h2 className="text-[#1b4d1b] text-3xl font-semibold mb-2">SIGN IN</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-[#1b4d1b] text-sm mb-1">Username</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-[#1b4d1b] bg-transparent py-2 text-[#1b4d1b] placeholder-[#1b4d1b]/70 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-[#1b4d1b] text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-[#1b4d1b] bg-transparent py-2 pr-10 text-[#1b4d1b] placeholder-[#1b4d1b]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-8 transform -translate-y-1/2 text-[#1b4d1b]"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm text-[#1b4d1b]">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-[#1b4d1b]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full font-medium text-white flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-[#5c8a5c] cursor-not-allowed"
                  : "bg-[#1b4d1b] hover:bg-[#133913]"
              } transition-all`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



