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
