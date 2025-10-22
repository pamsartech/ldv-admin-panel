import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto redirect if already authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (isAuth) navigate("/user/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://dev-api.payonlive.com/api/admin/login",
        { email, password }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ Save token & user in localStorage
        onLoginSuccess(token, user);

        toast.success("Login successful!");
        navigate("/user/dashboard");
      } else {
        const msg = response.data.message || "Login failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg w-full max-w-5xl overflow-hidden">
        {/* Logo */}
        <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-8">
          <img
            src="/icons/logo dv.svg"
            alt="Logo"
            className="w-40 h-40 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8 sm:p-10">
          <h2 className="text-green-800 text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
            SIGN IN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-green-800 bg-transparent py-2 text-green-800 placeholder-green-800 focus:outline-none"
              required
            />

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
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size="lg" />
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

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

