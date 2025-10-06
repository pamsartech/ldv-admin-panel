// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import SidebarNavigation from "../Components/SidebarNavigation";
// import Dashboard from "../Pages/Dashboard";
// import Products from "../pages/Products";
// import Orders from "../pages/Orders";
// import Customers from "../pages/Customers";
// import Payments from "../pages/Payments";
// import TikTokLive from "../pages/TikTokLive";
// import Setting from "../pages/Setting";
// import ViewProduct from "../Pages/ProductsSteps/ViewProduct"
// // import ViewProduct from "../pages/ViewProduct";
// import AddProductStep1 from "../Pages/ProductsSteps/AddProductStep1"
// import AddProductStep2 from "../Pages/ProductsSteps/AddProductStep2"
// import AddProductStep3 from "../Pages/ProductsSteps/AddProductStep3"
// // import AddProductStep1 from "../pages/AddProductStep1";
// // import AddProductStep2 from "../pages/AddProductStep2";
// // import AddProductStep3 from "../pages/AddProductStep3";
// import CreateOrder from "../Pages/OrderSteps/CreateOrder" 
// import ViewOrder from "../Pages/OrderSteps/ViewOrder" 
// // import CreateOrder from "../pages/CreateOrder";
// // import ViewOrder from "../pages/ViewOrder";
// import CreateCustomer from "../Pages/CustomerSteps/CreateCustomer"
// import ViewCustomer from "../Pages/CustomerSteps/ViewCustomer"
// // import CreateCustomer from "../pages/CreateCustomer";
// // import ViewCustomer from "../pages/ViewCustomer";
// import CreatePayment from "../Pages/PaymentSteps/CreatePayment"
// import ViewPayment from "../Pages/PaymentSteps/ViewPayment"
// // import CreatePayment from "../pages/CreatePayment";
// // import ViewPayment from "../pages/ViewPayment";
// import CreateLiveEvent from "../Pages/TikTok-Live-Session/CreateLiveEvent"
// import EventDetail from "../Pages/TikTok-Live-Session/EventDetail"
// // import CreateLiveEvent from "../pages/CreateLiveEvent";
// // import EventDetail from "../pages/EventDetail";

// export default function DashboardRoutes() {
//   return (
//     <Routes>
//       <Route path="/dashboard" element={<SidebarNavigation />}>
//         <Route index element={<Dashboard />} />
//         <Route path="products" element={<Products />} />
//         <Route path="orders" element={<Orders />} />
//         <Route path="customers" element={<Customers />} />
//         <Route path="payments" element={<Payments />} />
//         <Route path="tiktok" element={<TikTokLive />} />
//         <Route path="setting" element={<Setting />} />

//         {/* Product routes */}
//         <Route path="view-product" element={<ViewProduct />} />
//         <Route path="add-product/step1" element={<AddProductStep1 />} />
//         <Route path="add-product/step2" element={<AddProductStep2 />} />
//         <Route path="add-product/step3" element={<AddProductStep3 />} />

//         {/* Orders */}
//         <Route path="create-order" element={<CreateOrder />} />
//         <Route path="view-order" element={<ViewOrder />} />

//         {/* Customers */}
//         <Route path="create-customer" element={<CreateCustomer />} />
//         <Route path="view-customer" element={<ViewCustomer />} />

//         {/* Payments */}
//         <Route path="create-payment" element={<CreatePayment />} />
//         <Route path="view-payment" element={<ViewPayment />} />

//         {/* Live events */}
//         <Route path="create-live-event" element={<CreateLiveEvent />} />
//         <Route path="live-event-detail" element={<EventDetail />} />
//       </Route>
//     </Routes>
//   );
// }
