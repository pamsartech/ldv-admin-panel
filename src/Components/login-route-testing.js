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





// this is routes backup code 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";


// dashboard routes
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Payments from "./Pages/Payments";
import TikTokLive from "./Pages/TikTokLive";
import Setting from "./Pages/Setting";

import ViewProduct from "./Pages/ProductsSteps/ViewProduct";
import AddProductWizard from "./Pages/ProductsSteps/AddProductWizard";
import AddProductStep1 from "./Pages/ProductsSteps/AddProductStep1";
import AddProductStep2 from "./Pages/ProductsSteps/AddProductStep2";
import AddProductStep3 from "./Pages/ProductsSteps/AddProductStep3";
import UpdateProduct from "./Pages/ProductsSteps/UpdateProduct";

import CreateOrder from "./Pages/OrderSteps/CreateOrder";
import ViewOrder from "./Pages/OrderSteps/ViewOrder";
import UpdateOrder from "./Pages/OrderSteps/UpdateOrder";

import CreateCustomer from "./Pages/CustomerSteps/CreateCustomer";
import ViewCustomer from "./Pages/CustomerSteps/ViewCustomer";
import UpdateCustomer from "./Pages/CustomerSteps/UpdateCustomer";

import CreatePayment from "./Pages/PaymentSteps/CreatePayment";
import ViewPayment from "./Pages/PaymentSteps/ViewPayment";
import UpdatePayment from "./Pages/PaymentSteps/UpdatePayment";

import CreateLiveEvent from "./Pages/TikTok-Live-Session/CreateLiveEvent";
import EventDetail from "./Pages/TikTok-Live-Session/EventDetail";
import UpdateEvent from "./Pages/TikTok-Live-Session/UpdateEvent";


function App() {
  return (
    <div>
     

       {/* login routers */}
       <Router>
        <Routes>
           <Route path="/" element={ <Login /> } />
           <Route path="/reset-password" element={ <ResetPassword /> } />         
        </Routes>
      </Router>


      {/* this is dashboard routers */}
      <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <Routes>

            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/products" element={<Products />} />         
            <Route path="/user/orders" element={<Orders />} />
            <Route path="/user/customers" element={<Customers />} />
            <Route path="/user/payments" element={<Payments />} />
            <Route path="/user/tiktok" element={<TikTokLive />} />
            <Route path="/user/setting" element={<Setting />} />

            {/* this is product sub pages routes */}
            <Route path="/user/view-product/:productId" element={<ViewProduct />} />   
            <Route path="/user/add-product" element={<AddProductWizard />} />        
            <Route path="/user/update-product/:productId" element= { <UpdateProduct /> } />

            {/* this is order sub pages routes */}
            <Route path="/user/create-order" element= { <CreateOrder /> } />
            <Route path="/user/view-order/:orderId" element= { <ViewOrder /> } />
            <Route path="/user/update-order/:id" element= { <UpdateOrder /> } />

            {/* this is customer sub pages routes */}
            <Route path="/user/create-customer" element= { <CreateCustomer /> } />
            <Route path="/user/view-customer/:customerId" element= { <ViewCustomer /> } />
            <Route path="/user/update-customer/:customerId" element= { <UpdateCustomer /> } />

            {/* this is payment sub pages routes */}
            <Route path="/user/create-payment" element= { <CreatePayment /> } />
            <Route path="/user/view-payment/:paymentId" element= { <ViewPayment /> } />
            <Route path="/user/update-payment/:paymentId" element= { <UpdatePayment /> } />

            {/* this is tiktok live sub pages routes */}
            <Route path="/user/create-live-event" element= { <CreateLiveEvent /> } />
            <Route path="/user/live-event-detail/:eventId" element= { <EventDetail /> } />
            <Route path="/user/update-event/:eventId" element= { <UpdateEvent /> } />
           
          </Routes>
        </main>
      </div>
    </Router>  

    </div>
  );
}

export default App;





/ App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Payments from "./Pages/Payments";
import TikTokLive from "./Pages/TikTokLive";
import Setting from "./Pages/Setting";

// Components
import Sidebar from "./Components/Sidebar";

// Product Steps
import ViewProduct from "./Pages/ProductsSteps/ViewProduct";
import AddProductWizard from "./Pages/ProductsSteps/AddProductWizard";
import UpdateProduct from "./Pages/ProductsSteps/UpdateProduct";

// Order Steps
import CreateOrder from "./Pages/OrderSteps/CreateOrder";
import ViewOrder from "./Pages/OrderSteps/ViewOrder";
import UpdateOrder from "./Pages/OrderSteps/UpdateOrder";

// Customer Steps
import CreateCustomer from "./Pages/CustomerSteps/CreateCustomer";
import ViewCustomer from "./Pages/CustomerSteps/ViewCustomer";
import UpdateCustomer from "./Pages/CustomerSteps/UpdateCustomer";

// Payment Steps
import CreatePayment from "./Pages/PaymentSteps/CreatePayment";
import ViewPayment from "./Pages/PaymentSteps/ViewPayment";
import UpdatePayment from "./Pages/PaymentSteps/UpdatePayment";

// TikTok Live Session
import CreateLiveEvent from "./Pages/TikTok-Live-Session/CreateLiveEvent";
import EventDetail from "./Pages/TikTok-Live-Session/EventDetail";
import UpdateEvent from "./Pages/TikTok-Live-Session/UpdateEvent";

/* ---------------- Protected Route ---------------- */
function ProtectedRoute({ isAuthenticated }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

/* ---------------- Dashboard Layout ---------------- */
function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

/* ---------------- Main App ---------------- */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(storedAuth);
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  // Handle logout (optional helper)
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />

        {/* ---------- Protected Routes ---------- */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<DashboardLayout />}>
            {/* Main Dashboard Routes */}
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/products" element={<Products />} />
            <Route path="/user/orders" element={<Orders />} />
            <Route path="/user/customers" element={<Customers />} />
            <Route path="/user/payments" element={<Payments />} />
            <Route path="/user/tiktok" element={<TikTokLive />} />
            <Route path="/user/setting" element={<Setting />} />

            {/* Product Sub Routes */}
            <Route path="/user/view-product/:productId" element={<ViewProduct />} />
            <Route path="/user/add-product" element={<AddProductWizard />} />
            <Route path="/user/update-product/:productId" element={<UpdateProduct />} />

            {/* Order Sub Routes */}
            <Route path="/user/create-order" element={<CreateOrder />} />
            <Route path="/user/view-order/:orderId" element={<ViewOrder />} />
            <Route path="/user/update-order/:id" element={<UpdateOrder />} />

            {/* Customer Sub Routes */}
            <Route path="/user/create-customer" element={<CreateCustomer />} />
            <Route path="/user/view-customer/:customerId" element={<ViewCustomer />} />
            <Route path="/user/update-customer/:customerId" element={<UpdateCustomer />} />

            {/* Payment Sub Routes */}
            <Route path="/user/create-payment" element={<CreatePayment />} />
            <Route path="/user/view-payment/:paymentId" element={<ViewPayment />} />
            <Route path="/user/update-payment/:paymentId" element={<UpdatePayment />} />

            {/* TikTok Live Sub Routes */}
            <Route path="/user/create-live-event" element={<CreateLiveEvent />} />
            <Route path="/user/live-event-detail/:eventId" element={<EventDetail />} />
            <Route path="/user/update-event/:eventId" element={<UpdateEvent />} />
          </Route>
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;








// alert code
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    type: "info", // 'success', 'error', 'info'
    onConfirm: null,
  });

  const showAlert = useCallback((message, type = "info", onConfirm = null) => {
    setAlertState({ open: true, message, type, onConfirm });
  }, []);

  const handleClose = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
    if (alertState.onConfirm) alertState.onConfirm();
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 40 }} />;
      case "error":
        return <ErrorIcon sx={{ color: "#F44336", fontSize: 40 }} />;
      case "info":
      default:
        return <InfoIcon sx={{ color: "#2196F3", fontSize: 40 }} />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Dialog open={alertState.open} onClose={handleClose}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {getIcon(alertState.type)}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {alertState.type === "success"
                ? "Success"
                : alertState.type === "error"
                ? "Error"
                : "Info"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mt: 1 }}>{alertState.message}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

