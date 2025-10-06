import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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
      // Send POST request to your login API
      const response = await axios.post("https://la-dolce-vita.onrender.com/api/admin/login", {
        email: username, // Assuming your backend expects "email"
        password: password,
      });

      if (response.data.success) {
        // Save token in localStorage
        localStorage.setItem("token", response.data.token);

        // Optionally save user info
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
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
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b-2 border-green-800 bg-transparent py-2 text-green-800 placeholder-green-800 focus:outline-none"
                required
              />
            </div>

            {/* Password with toggle */}
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
                className="absolute right-0 transform -translate-y-1/2 pr-2 text-green-800 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.434m1.77-1.77A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.223 2.432M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember me + Forgot password */}
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
                onClick={() => navigate("/reset-password")}
                className="hover:underline text-center sm:text-right"
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit */}
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
