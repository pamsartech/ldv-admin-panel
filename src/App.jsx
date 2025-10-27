import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Sidebar from "./Components/Sidebar";

// 📄 Main Pages
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Payments from "./Pages/Payments";
import TikTokLive from "./Pages/TikTokLive";
import Setting from "./Pages/Setting";

// 🧾 Product Steps
import ViewProduct from "./Pages/ProductsSteps/ViewProduct";
import AddProductWizard from "./Pages/ProductsSteps/AddProductWizard";
import AddProductStep1 from "./Pages/ProductsSteps/AddProductStep1";
import AddProductStep2 from "./Pages/ProductsSteps/AddProductStep2";
import AddProductStep3 from "./Pages/ProductsSteps/AddProductStep3";
import UpdateProduct from "./Pages/ProductsSteps/UpdateProduct";

// 🛒 Order Steps
import CreateOrder from "./Pages/OrderSteps/CreateOrder";
import ViewOrder from "./Pages/OrderSteps/ViewOrder";
import UpdateOrder from "./Pages/OrderSteps/UpdateOrder";

// 👤 Customer Steps
import CreateCustomer from "./Pages/CustomerSteps/CreateCustomer";
import ViewCustomer from "./Pages/CustomerSteps/ViewCustomer";
import UpdateCustomer from "./Pages/CustomerSteps/UpdateCustomer";

// 💳 Payment Steps
import CreatePayment from "./Pages/PaymentSteps/CreatePayment";
import ViewPayment from "./Pages/PaymentSteps/ViewPayment";
import UpdatePayment from "./Pages/PaymentSteps/UpdatePayment";

// 🎥 TikTok Live Session Steps
import CreateLiveEvent from "./Pages/TikTok-Live-Session/CreateLiveEvent";
import EventDetail from "./Pages/TikTok-Live-Session/EventDetail";
import UpdateEvent from "./Pages/TikTok-Live-Session/UpdateEvent";

// 🔐 Auth & Layout Components
import ProtectedRoute from "./Components/ProtectedRoute";
import UserLayout from "./Components/UserLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Route ---------- */}
        <Route path="/login" element={<Login />} />

        {/* ---------- Protected Routes ---------- */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          {/* 📊 Main Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="payments" element={<Payments />} />
          <Route path="tiktok" element={<TikTokLive />} />
          <Route path="setting" element={<Setting />} />

          {/* 🧾 Product Steps */}
          <Route path="view-product/:productId" element={<ViewProduct />} />
          <Route path="add-product" element={<AddProductWizard />} />
          <Route path="add-product/step-1" element={<AddProductStep1 />} />
          <Route path="add-product/step-2" element={<AddProductStep2 />} />
          <Route path="add-product/step-3" element={<AddProductStep3 />} />
          <Route path="update-product/:productId" element={<UpdateProduct />} />

          {/* 🛍️ Order Steps */}
          <Route path="create-order" element={<CreateOrder />} />
          <Route path="view-order/:orderId" element={<ViewOrder />} />
          <Route path="update-order/:id" element={<UpdateOrder />} />

          {/* 👤 Customer Steps */}
          <Route path="create-customer" element={<CreateCustomer />} />
          <Route path="view-customer/:customerId" element={<ViewCustomer />} />
          <Route path="update-customer/:customerId" element={<UpdateCustomer />} />

          {/* 💳 Payment Steps */}
          <Route path="create-payment" element={<CreatePayment />} />
          <Route path="view-payment/:paymentId" element={<ViewPayment />} />
          <Route path="update-payment/:paymentId" element={<UpdatePayment />} />

          {/* 🎥 TikTok Live Steps */}
          <Route path="create-live-event" element={<CreateLiveEvent />} />
          <Route path="live-event-detail/:eventId" element={<EventDetail />} />
          <Route path="update-event/:eventId" element={<UpdateEvent />} />
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


