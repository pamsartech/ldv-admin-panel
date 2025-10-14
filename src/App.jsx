import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
// import HomeRoutes from "./Routers/HomeRouter";
// import DashboardRoutes from "./Routers/DashboardRouter";


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
     

       

      {/* this is home page navigation  */}
      {/* <Router>
        <Routes>
           <Route path="/" element={ <Home /> } />
           <Route path="/choose-item/step-1" element={ <PurchaseStep1 /> } />
           <Route path="/choose-item/step-2" element={ <PurchaseStep2 /> } />
           <Route path="/create-account"    element={ <CreateAccount /> } />
           <Route path="/choose-item/step-3" element={ <PurchaseStep3 /> } />
           <Route path="/choose-item/step-4" element={ <PurchaseStep4 /> } />
          
        </Routes>
      </Router> */}

       {/* login routers */}
       {/* <Router>
        <Routes>
           <Route path="/" element={ <Login /> } />
           <Route path="/reset-password" element={ <ResetPassword /> } />
          
        </Routes>
      </Router> */}



      {/* this is dashboard routers */}
      <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/tiktok" element={<TikTokLive />} />
            <Route path="/setting" element={<Setting />} />

            <Route path="/view-product/:productId" element={<ViewProduct />} />   
            <Route path="/add-product" element={<AddProductWizard />} />        
            <Route path="/update-product/:productId" element= { <UpdateProduct /> } />

            <Route path="/create-order" element= { <CreateOrder /> } />
            <Route path="/view-order/:orderId" element= { <ViewOrder /> } />
            <Route path="/update-order/:id" element= { <UpdateOrder /> } />

            <Route path="/create-customer" element= { <CreateCustomer /> } />
            <Route path="/view-customer/:customerId" element= { <ViewCustomer /> } />
            <Route path="/update-customer/:customerId" element= { <UpdateCustomer /> } />

            <Route path="/create-payment" element= { <CreatePayment /> } />
            <Route path="/view-payment/:paymentId" element= { <ViewPayment /> } />
            <Route path="/update-payment/:paymentId" element= { <UpdatePayment /> } />

            <Route path="/create-live-event" element= { <CreateLiveEvent /> } />
            <Route path="/live-event-detail/:eventId" element= { <EventDetail /> } />
            <Route path="/update-event/:eventId" element= { <UpdateEvent /> } />

           
          </Routes>
        </main>
      </div>
    </Router>  

    </div>
  );
}

export default App;
