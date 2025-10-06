import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Orders from "./Orders";
import Customers from "./Customers";
import Payments from "./Payments";
import TikTokLive from "./TikTokLive";
import Setting from "./Setting";
import ViewProduct from "./ProductsSteps/ViewProduct";
import AddProductStep1 from "./ProductsSteps/AddProductStep1";
import AddProductStep2 from "./ProductsSteps/AddProductStep2";
import AddProductStep3 from "./ProductsSteps/AddProductStep3";
import CreateOrder from "./OrderSteps/CreateOrder";
import ViewOrder from "./OrderSteps/ViewOrder";
import CreateCustomer from "./CustomerSteps/CreateCustomer";
import ViewCustomer from "./CustomerSteps/ViewCustomer";
import CreatePayment from "./PaymentSteps/CreatePayment";
import ViewPayment from "./PaymentSteps/ViewPayment";
import CreateLiveEvent from "./TikTok-Live-Session/CreateLiveEvent";
import EventDetail from "./TikTok-Live-Session/EventDetail";


function Navigation () {


    return (

   
        <div className="flex">
           
        <main >
         <Sidebar />
        </main>
         <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/tiktok" element={<TikTokLive />} />
            <Route path="/setting" element={<Setting />} />

            <Route path="/view-product" element={<ViewProduct />} />
            <Route path="/add-product/step1" element={<AddProductStep1 />} />
            <Route path="/add-product/step2" element={<AddProductStep2 />} />
            <Route path="/add-product/step3" element={<AddProductStep3 />} />

            <Route path="/create-order" element= { <CreateOrder /> } />
            <Route path="/admin/view-order" element= { <ViewOrder /> } />

            <Route path="/create-customer" element= { <CreateCustomer /> } />
            <Route path="/view-customer" element= { <ViewCustomer /> } />

            <Route path="/create-payment" element= { <CreatePayment /> } />
            <Route path="/view-payment" element= { <ViewPayment /> } />

            <Route path="/create-live-event" element= { <CreateLiveEvent /> } />
            <Route path="/live-event-detail" element= { <EventDetail /> } />
            
          </Routes>
        </div>
        
  
    )
}

export default Navigation;