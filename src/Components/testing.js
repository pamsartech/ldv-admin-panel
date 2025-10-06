import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faFilter,
  faUpDown,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// Sample data
const customersData = [
  {
    id: "12371981",
    name: "James",
    spend: "€131231",
    date: "01/12/2025",
    email: "jamesimth14@gmail.com",
    orders: 47,
    status: "Active",
  },
  {
    id: "12371982",
    name: "Emily",
    spend: "€98200",
    date: "01/12/2025",
    email: "emily14@gmail.com",
    orders: 67,
    status: "Deactive",
  },
  {
    id: "12371983",
    name: "Michael",
    spend: "€45200",
    date: "02/01/2025",
    email: "michael123@gmail.com",
    orders: 23,
    status: "Active",
  },
  {
    id: "12371984",
    name: "Sophia",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Deactive",
  },
  {
    id: "12371985",
    name: "Jack",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Deactive",
  },
  {
    id: "12371986",
    name: "John",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Active",
  },
  {
    id: "12371987",
    name: "Brock",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Active",
  },
  {
    id: "12371988",
    name: "Jey",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Active",
  },
  {
    id: "12371989",
    name: "Robert",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Deactive",
  },
  {
    id: "12371990",
    name: "Cody",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Active",
  },
  {
    id: "12371991",
    name: "Seth",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Active",
  },
  {
    id: "12371992",
    name: "Kurt",
    spend: "€75500",
    date: "03/05/2025",
    email: "sophia@example.com",
    orders: 15,
    status: "Deactive",
  },
];

export default function CustomersTable() {
  const navigate = useNavigate();

  // state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  // filtering + sorting logic
  const filteredData = useMemo(() => {
    let data = [...customersData];

    // search
    if (search.trim()) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toString().includes(search)
      );
    }

    // filter by status
    if (filterStatus !== "All") {
      data = data.filter((c) => c.status === filterStatus);
    }

    // sort
    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === "spend") {
          valA = parseFloat(valA.replace("€", ""));
          valB = parseFloat(valB.replace("€", ""));
        }
        if (sortField === "orders") {
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [search, filterStatus, sortField, sortOrder]);

  // pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, filteredData.length);

  // toggle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      {/* filter bar */}
      <div className="flex gap-2 mx-6 relative mt-2">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filter dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 border border-gray-400 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-10">
              {["All", "Active", "Deactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowFilter(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    filterStatus === status ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort button */}
        <button
          className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
          onClick={() => handleSort("spend")}
        >
          <FontAwesomeIcon icon={faUpDown} />
          Sort
        </button>
      </div>

      {/* customer data table */}
      <div className="p-6 bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-3 px-3">Customer ID</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Total Spend</th>
              <th className="py-3 px-3">Date Joined</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3">Total Orders</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{customer.id}</td>
                  <td className="py-3 px-3">{customer.name}</td>
                  <td className="py-3 px-3">{customer.spend}</td>
                  <td className="py-3 px-3">{customer.date}</td>
                  <td className="py-3 px-3">{customer.email}</td>
                  <td className="py-3 px-3">{customer.orders}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 text-center py-1 rounded-xl text-sm font-medium ${
                        customer.status === "Active"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 cursor-pointer">
                    <button onClick={() => navigate("/view-customer")}>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No matching results
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination + Info */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-4 text-sm text-gray-600 gap-3">
          <p className="px-2">
            Showing <span className="font-medium">{startIndex}</span>–
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{filteredData.length}</span> customers
          </p>

          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




// order data table code 

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faCircleCheck,
  faChartLine,
  faBoxArchive,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ordersData = [
  { id: "#1223", customer: "James", product: "Denim shirt 2782", payment: "Pending", shipping: "Shipped" },
  { id: "#1224", customer: "Emily", product: "Denim shirt 2782", payment: "Paid", shipping: "Dispatched" },
  { id: "#1225", customer: "David", product: "Denim shirt 2782", payment: "Pending", shipping: "Delivered" },
  { id: "#1226", customer: "Sophia", product: "Denim shirt 2782", payment: "Paid", shipping: "Shipped" },
  { id: "#1227", customer: "Liam", product: "Denim shirt 2782", payment: "Pending", shipping: "Cancelled" },
  { id: "#1228", customer: "Olivia", product: "Denim shirt 2782", payment: "Failed", shipping: "Out for delivery" },
  { id: "#1229", customer: "Noah", product: "Denim shirt 2782", payment: "Pending", shipping: "Shipped" },
  { id: "#1230", customer: "Emma", product: "Denim shirt 2782", payment: "Paid", shipping: "Delivered" },
  { id: "#1223", customer: "James", product: "Denim shirt 2782", payment: "Pending", shipping: "Shipped" },
  { id: "#1224", customer: "Emily", product: "Denim shirt 2782", payment: "Paid", shipping: "Dispatched" },
  { id: "#1230", customer: "Emma", product: "Denim shirt 2782", payment: "Paid", shipping: "Delivered" },
  { id: "#1223", customer: "James", product: "Denim shirt 2782", payment: "Pending", shipping: "Shipped" },
  { id: "#1224", customer: "Emily", product: "Denim shirt 2782", payment: "Paid", shipping: "Dispatched" },
  { id: "#1225", customer: "David", product: "Denim shirt 2782", payment: "Pending", shipping: "Delivered"}
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Paid: "bg-green-100 text-green-700 border border-green-300",
  Failed: "bg-red-100 text-red-700 border border-red-300",
  Shipped: "bg-blue-100 text-blue-700 border border-blue-300",
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  Cancelled: "bg-red-100 text-red-700 border border-red-300",
  Dispatched: "bg-purple-100 text-purple-700 border border-purple-300",
  "Out for delivery": "bg-orange-100 text-orange-700 border border-orange-300",
};

export default function OrdersDataTable() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // filters
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);

  const ordersPerPage = 8;

  // Filter + Sort + Tabs
  const filteredOrders = useMemo(() => {
    let result = [...ordersData];

    // tabs filter example
    if (activeTab === "active") {
      result = result.filter((o) => o.payment === "Pending" || o.shipping === "Shipped");
    } else if (activeTab === "archived") {
      result = result.filter((o) => o.shipping === "Delivered" || o.shipping === "Cancelled");
    }

    // payment filter
    if (filterPayment !== "all") {
      result = result.filter((o) => o.payment === filterPayment);
    }

    // sorting
    result.sort((a, b) =>
      sortAsc ? a.customer.localeCompare(b.customer) : b.customer.localeCompare(a.customer)
    );

    return result;
  }, [activeTab, filterPayment, sortAsc]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div>
      {/* Tabs + Filters */}
      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">
        <div className="flex gap-6">
          <button
            onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "all"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} /> All
          </button>

          <button
            onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "active"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} /> Active
          </button>

          <button
            onClick={() => { setActiveTab("archived"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "archived"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBoxArchive} /> Archived
          </button>
        </div>

        {/* Filter + Sort */}
        <div className="flex gap-2">
          <select
            value={filterPayment}
            onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}
            className="border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900"
          >
            <option value="all">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100"
          >
            Sort {sortAsc ? "A→Z" : "Z→A"}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-12 gap-4">
          <div
            className={`bg-white rounded-lg shadow p-4 transition-all duration-300 ${
              selectedOrder ? "col-span-9" : "col-span-12"
            }`}
          >
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Shipping Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.product}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.payment]}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.shipping]}`}>
                        {order.shipping}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      <button onClick={() => setSelectedOrder(order)} className="hover:text-black">
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </button>

              <div className="space-x-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === idx + 1 ? "bg-black text-white" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

           <div className="grid grid-cols-2 lg:w-3xl gap-6 mt-16 mx-auto">
      {/* TikTok Live Event Card */}
      <div className="bg-white rounded-lg shadow p-6 border">
        <h3 className="font-semibold text-gray-800">TikTok Live Event</h3>
        <div className="flex gap-8 mt-6 text-sm font-medium text-gray-700">
          <button className="hover:text-black">Day</button>
          <button className="hover:text-black">Week</button>
          <button className="hover:text-black">Month</button>
        </div>
      </div>

      {/* Average Order Value Card */}
      <div className="bg-white rounded-lg shadow p-6 border flex items-center justify-between">
        {/* Left Section */}
        <div>
          <h3 className="font-semibold text-gray-800">Average Order value</h3>
          <p className="text-2xl font-bold mt-2">€28</p>
          <p className="text-gray-600 text-sm">Average Order value</p>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 h-16 mx-6"></div>

        {/* Right Section */}
        <div className="text-sm text-gray-700">
          <p className="font-medium">Delivery status</p>
          <p className="mt-1">
            Delivered : <span className="font-semibold">75%</span>
          </p>
        </div>
      </div>
    </div>

          </div>

          {/* Right Panel */}
          {selectedOrder && (
            <div className="col-span-3 bg-white rounded-lg shadow p-6 transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-md font-medium">Order {selectedOrder.id}</h2>
                <button className=" underline" onClick={() => navigate("/view-order")}> View Details</button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-black"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
          
              {/* Order Info */}
              <div className="mt-4 text-xs text-gray-700 space-y-2">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> 20/08/2025</p>
                <p><strong>Order amount:</strong> €28.23</p>
                <p><strong>Status:</strong> {selectedOrder.payment}</p>
              </div>
          
              <hr className="my-4" />
          
              {/* Customer Info */}
              <div className="text-xs text-gray-700 space-y-2">
                <h3 className="font-bold text-sm text-gray-800">Customer Info</h3>
                <p> <strong>Name:</strong>  {selectedOrder.customer} Smith</p>
                <p> <strong>Email:</strong>  {selectedOrder.customer.toLowerCase()}@gmail.com</p>
                <p> <strong>Phone:</strong>  9238972921</p>
              </div>
          
              <hr className="my-4" />
          
              {/* Payment Info */}
              <div className="text-xs text-gray-700 space-y-2">
                <h3 className="font-bold text-sm text-gray-800">Payment Info</h3>
                <p> <strong>Method:</strong>  Stripe</p>
                <p> <strong>Status: </strong> {selectedOrder.payment}</p>
                <p> <strong>Transaction ID:</strong>  21e71378182221</p>
              </div>
          
              <hr className="my-4" />
          
              {/* TikTok Live Ref */}
              <div className="text-xs text-gray-700 space-y-2">
                <h3 className="font-bold text-sm text-gray-800">TikTok Live Ref</h3>
                <p> <strong>Session name:</strong>  Clothing code</p>
              </div>
          
              <hr className="my-4" />
          
              {/* Products Sold */}
              <div>
                <h3 className="font-bold text-gray-800">Products Sold</h3>
                <div className="space-y-2 mt-2">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg"
                          alt="Product"
                          className="w-8 h-8 rounded object-cover"
                        />
                        
                      </div>
                      <span className="text-xs ">Denim shirt</span>
                      <span className="text-xs ">€13.53</span>
                    </div>
                  ))}
                </div>
              </div>
          
              <hr className="my-4" />
          
              {/* Totals */}
              <div className="text-sm text-end  text-gray-700 space-y-1">
                <p> <strong className="px-1 font-semibold">Subtotal:</strong>  €28.23</p>
                <p> <strong className="px-1 font-semibold"> Shipping : </strong>  Free</p>
                <p>  <strong className="px-1 font-semibold">Total:</strong>  €28.23</p>
              </div>
            </div>
          )}

        
        </div>
      </div>
    </div>
  );
}


// payment update code 
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCreditCard, faXmark, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function UpdatePayment() {
  const navigate = useNavigate();
  const { id: paymentId } = useParams();

  const [paymentData, setPaymentData] = useState({
    customerName: "",
    customerId: "",
    email: "",
    phone: "",
    orderId: "",
    transactionId: "",
    amount: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    deliveryStatus: "Pending",
    dateTime: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPaymentData({ ...paymentData, [id]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/payments/${paymentId}`, paymentData);
      alert("Payment updated successfully!");
      navigate("/Payments");
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment. Please try again.");
    }
  };

  // Helper function to get CSS class based on status
  const getStatusClass = (status, type) => {
    if (type === "payment") {
      switch (status) {
        case "Paid": return "bg-green-100 text-green-600 border-green-400";
        case "Pending": return "bg-orange-100 text-orange-600 border-orange-400";
        case "Failed": return "bg-red-100 text-red-600 border-red-400";
        default: return "bg-gray-100 text-gray-600 border-gray-400";
      }
    } else if (type === "delivery") {
      switch (status) {
        case "Delivered": return "bg-green-100 text-green-600 border-green-400";
        case "Shipped": return "bg-blue-100 text-blue-600 border-blue-600";
        case "Pending": return "bg-orange-100 text-orange-600 border-orange-400";
        case "Cancelled": return "bg-red-100 text-red-600 border-red-400";
        default: return "bg-gray-100 text-gray-600 border-gray-400";
      }
    }
  };

  return (
    <div>
      <Navbar heading="Payment Management" />

      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Payment Details</h1>
        <button
          onClick={() => navigate("/Payments")}
          className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="text-white px-2" />  
          Back to Main View
        </button>
      </div>

      <form className="p-6 max-w-5xl mx-5 space-y-6" onSubmit={handleUpdate}>
        {/* Customer Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              required
              id="customerName"
              type="text"
              placeholder="Full name"
              value={paymentData.customerName}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            /> 
            </div>

            <div>
             <label className="block text-sm font-medium mb-1">Customer ID</label>
            <input
              required
              id="customerId"
              type="text"
              placeholder="#121214131"
              value={paymentData.customerId}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            </div>

            <div>
             <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              id="email"
              type="email"
              placeholder="jamesmith12@gmail.com"
              value={paymentData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input
              required
              id="phone"
              type="number"
              placeholder="+121 1231 1212"
              value={paymentData.phone}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
             </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
           <label className="block text-sm font-medium mb-1">Order ID</label>
            <input
              required
              id="orderId"
              type="number"
              placeholder="#1811"
              value={paymentData.orderId}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            /> 
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Transaction ID</label>
            <input
              required
              id="transactionId"
              type="number"
              placeholder="#qwivq12561"
              value={paymentData.transactionId}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              required
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="€ 12.99"
              value={paymentData.amount}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            </div>

            <div>
           <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              required
              id="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Payment Method</option>
              <option value="Stripe">Stripe</option>
              <option value="PayPal">PayPal</option>
            </select> 
            </div>

            <div>
           <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              required
              id="paymentStatus"
              value={paymentData.paymentStatus}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Payment Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Delivery Status</label>
            <select
              required
              id="deliveryStatus"
              value={paymentData.deliveryStatus}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Delivery Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Time & Date</label>
            <input
              required
              id="dateTime"
              type="datetime-local"
              value={paymentData.dateTime}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
            </div>

            <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              id="notes"
              placeholder="Add any additional notes about this payment"
              value={paymentData.notes}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm h-24"
            />
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border border-gray-400 lg:w-1/2 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Status Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2 font-medium">Payment Status</p>
              <span className={`px-3 py-1 mt-4 text-xs rounded-full border ${getStatusClass(paymentData.paymentStatus, "payment")}`}>
                <FontAwesomeIcon icon={faClock} className="pr-2" />
                {paymentData.paymentStatus || "Pending"}
              </span>
            </div>

            <div>
              <p className="text-sm mb-2 font-medium">Delivery Status</p>
              <span className={`px-3 py-1 text-xs rounded-full border ${getStatusClass(paymentData.deliveryStatus, "delivery")}`}>
                {paymentData.deliveryStatus || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/Payments")}
            className="w-full md:w-auto flex items-center justify-center border border-red-600 gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-200"
          >
            <FontAwesomeIcon icon={faXmark} />
            Discard Payment
          </button>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#114E9D] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Update Payment
          </button>
        </div>
      </form>
    </div>
  );
}






// product table code 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
  faAngleRight,
  faBoxArchive,
  faCircleCheck,
  faChartLine,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// 🔹 Product Data with status
const products = [
  { id: 1, name: "Denim shirt 202035", price: "€12", sessionId: "CL0243", category: "Clothing", sku: "0023 TSHIRT-BLU-SM", status: "active", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYV9RVuMHX3iHk35tfowX-7l1y42YrMJ0KeoJn-Cki4cPVRK6zX9sssrUhtrN7wUPBVU&usqp=CAU" },
  { id: 2, name: "Denim shirt 202045", price: "€15", sessionId: "FT0243", category: "Clothing", sku: "0023 TSHIRT-LBLU-SM", status: "active", image: "https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg" },
  { id: 3, name: "Hoodie 202101", price: "€20", sessionId: "HD0243", category: "Clothing", sku: "0034 HOODIE-BLK-L", status: "archived", image: "https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg" },
  { id: 4, name: "Sneakers 202155", price: "€50", sessionId: "SN0243", category: "Shoes", sku: "0045 SNKR-WHT-42", status: "active", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYV9RVuMHX3iHk35tfowX-7l1y42YrMJ0KeoJn-Cki4cPVRK6zX9sssrUhtrN7wUPBVU&usqp=CAU" },
  { id: 5, name: "Cap 202200", price: "€8", sessionId: "CP0243", category: "Accessories", sku: "0056 CAP-BLU-ONE", status: "archived", image: "https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg" },
  { id: 6, name: "Jacket 202245", price: "€70", sessionId: "JK0243", category: "Clothing", sku: "0067 JKT-GRN-XL", status: "active", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYV9RVuMHX3iHk35tfowX-7l1y42YrMJ0KeoJn-Cki4cPVRK6zX9sssrUhtrN7wUPBVU&usqp=CAU" },
  { id: 7, name: "Watch 202300", price: "€120", sessionId: "WT0243", category: "Accessories", sku: "0078 WTC-SLV-STD", status: "active", image: "https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg" },
  { id: 8, name: "Socks 202355", price: "€5", sessionId: "SC0243", category: "Clothing", sku: "0089 SOCK-BLK-3P", status: "archived", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYV9RVuMHX3iHk35tfowX-7l1y42YrMJ0KeoJn-Cki4cPVRK6zX9sssrUhtrN7wUPBVU&usqp=CAU" },
  { id: 9, name: "Backpack 202400", price: "€45", sessionId: "BP0243", category: "Accessories", sku: "0090 BP-BLK-MED", status: "active", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYV9RVuMHX3iHk35tfowX-7l1y42YrMJ0KeoJn-Cki4cPVRK6zX9sssrUhtrN7wUPBVU&usqp=CAU" },
  { id: 10, name: "Sunglasses 202455", price: "€30", sessionId: "SG0243", category: "Accessories", sku: "0101 SUN-BLK-STD", status: "archived", image: "https://m.media-amazon.com/images/I/81+uJH8pxYL._UY1100_.jpg" },
];

export default function ProductTable() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const rowsPerPage = 7;

  // 🔹 Filter by Tab (status)
  let filteredProducts = products;
  if (activeTab === "active") {
    filteredProducts = filteredProducts.filter((p) => p.status === "active");
  } else if (activeTab === "archived") {
    filteredProducts = filteredProducts.filter((p) => p.status === "archived");
  }

  // 🔹 Filter by Category
  filteredProducts =
    selectedCategory === "All"
      ? filteredProducts
      : filteredProducts.filter((p) => p.category === selectedCategory);

  // 🔹 Sort
  filteredProducts =
    sortOrder === "asc"
      ? [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
      : [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  // 🔹 Select all / row
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelected(currentProducts.map((p) => p.id));
    else setSelected([]);
  };
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const allSelected =
    currentProducts.length > 0 &&
    currentProducts.every((p) => selected.includes(p.id));

  return (
    <div>
      {/* Tabs & Filter/Sort */}
      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">
        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "all"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} /> All
          </button>
          <button
            onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "active"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} /> Active
          </button>
          <button
            onClick={() => { setActiveTab("archived"); setCurrentPage(1); }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "archived"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBoxArchive} /> Archived
          </button>
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-2 relative">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
            >
              <img src="/icons/cuida_filter-outline.svg" alt="filter-icon" className="w-4 h-4" />
              {selectedCategory === "All" ? "Filter" : selectedCategory}
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-gray-600" />
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                {["All", "Clothing", "Shoes", "Accessories"].map((cat) => (
                  <div
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); setShowFilter(false); }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition"
            >
              <img src="/icons/flowbite_sort-outline.svg" alt="sort-icon" className="w-4 h-4" />
              Sort
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-gray-600" />
            </button>
            {showSort && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
                <div onClick={() => { setSortOrder("asc"); setShowSort(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">A → Z</div>
                <div onClick={() => { setSortOrder("desc"); setShowSort(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Z → A</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto border-gray-400 rounded-lg shadow bg-white mx-6 mt-5">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b">
            <tr>
              <th className="p-3">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
              </th>
              <th className="p-3">Product Image</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Session ID</th>
              <th className="p-3">Category</th>
              <th className="p-3">ID Article/SKU</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((item) => (
              <tr key={item.id} className={`border-b hover:bg-gray-50 transition-colors ${selected.includes(item.id) ? "bg-gray-50" : ""}`}>
                <td className="p-3">
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                </td>
                <td className="p-3 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover border" />
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.price}</td>
                <td className="p-3">{item.sessionId}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3 flex gap-4 justify-center">
                  <button className="text-gray-500 hover:text-gray-700"><FontAwesomeIcon icon={faTrash} /></button>
                  <button onClick={() => navigate("/view-product")} className="text-gray-600 hover:text-black"><FontAwesomeIcon icon={faAngleRight} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-3 text-sm text-gray-600 bg-gray-50 border-t">
          <span className="text-gray-500">
            Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredProducts.length)} of {filteredProducts.length}
          </span>
          <div className="flex gap-2 items-center">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 border rounded flex items-center gap-1 ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}>
              <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-black text-white" : "hover:bg-gray-100"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1 border rounded flex items-center gap-1 ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}>
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



// create customer code 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CreateCustomer = () => {
  const navigate = useNavigate();

  // 🟢 State for basic info & address
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    password: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "Italy",
  });

  const [statusActive, setStatusActive] = useState(true);
  const [communicationMethod, setCommunicationMethod] = useState("Email");
  const [marketingPrefs, setMarketingPrefs] = useState({
    offers: false,
    newsletter: false,
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // toggle marketing preferences
  const handleMarketingChange = (field) => {
    setMarketingPrefs({ ...marketingPrefs, [field]: !marketingPrefs[field] });
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = {
  customerName: formData.customerName,
  email: formData.email,
  phoneNumber: formData.phoneNumber.toString(),
  dob: formData.dob,
  password: formData.password,
  address: {
    street: formData.street,
    city: formData.city,
    state: formData.state,
    zipcode: formData.zipcode.toString(),
    country: formData.country,
  },
  isActive: statusActive,
  communicationMethod: communicationMethod.toLowerCase()
};

      const res = await axios.post(
        "https://la-dolce-vita.onrender.com/api/user/create-customer",
        payload
      );
      console.log("✅ Customer created:", res.data);
      alert("customer created successfully!");
      navigate("/Customers"); // redirect after save
    } catch (err) {
      console.error("❌ Error saving customer:", err);
      alert("Failed to create order.");
    }
  };

  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Add New Customer</h1>
        <button
          onClick={() => navigate("/Customers")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-red-700 px-2"
          />
          Discard Product
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700"
      >
        {/* Basic Information */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          {/* Status toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <button
              type="button"
              onClick={() => setStatusActive(!statusActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                statusActive ? "bg-green-400" : "bg-gray-300"
              }`}
              aria-label="Toggle status"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  statusActive ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                statusActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {statusActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Customer Name
              </label>
              <input
                required
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Email Address
              </label>
              <input
                required
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Phone number
              </label>
              <input
                required
                id="phoneNumber"
                type="number"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+122 2131 3212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Date of birth
              </label>
              <input
                required
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                placeholder="dd-mm-yyyy"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Password
              </label>
              <input
                required
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="enter password"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-4">
          <h3 className="text-md font-semibold">Address</h3>
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium mb-1 text-gray-600"
            >
              Street address
            </label>
            <input
              required
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter street address"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                City
              </label>
              <input
                required
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                State
              </label>
              <input
                required
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Zip Code
              </label>
              <input
                required
                id="zipcode"
                type="number"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Country
              </label>
              <select
                required
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option>Italy</option>
                <option>France</option>
                <option>Germany</option>
                <option>USA</option>
              </select>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="border border-gray-400 rounded-lg p-6 col-span-2 space-y-6">
            <h3 className="text-md font-semibold">Preferences</h3>
            <div>
              <label
                htmlFor="preferredMethod"
                className="block text-sm font-medium mb-1 text-gray-600"
              >
                Preferred Communication Method
              </label>
              <select
                required
                id="communicationMethod"
                value={communicationMethod}
                onChange={(e) => setCommunicationMethod(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option>email</option>
                <option>phone</option>
                <option>sms</option>
              </select>
            </div>

            <fieldset className="text-sm text-gray-700">
              <h6 className="mb-2 font-medium">Marketing Preferences</h6>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.offers}
                  onChange={() => handleMarketingChange("offers")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Receive offers and promotions</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketingPrefs.newsletter}
                  onChange={() => handleMarketingChange("newsletter")}
                  className="form-checkbox rounded border-gray-400"
                />
                <span>Subscribe to newsletter</span>
              </label>
            </fieldset>
          </section>

          {/* Profile Preview */}

          <section className="border border-gray-400 rounded-lg p-6">
            <h3 className="text-md font-semibold mb-4">
              New Customer Profile Preview
            </h3>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Customer"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">Customer Name</p>
              <p className="text-xs text-gray-500">email@example.com</p>
            </div>
            <hr className="text-gray-400 mt-4" />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Status :</span>{" "}
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    statusActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {statusActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer ID :</span>{" "}
                <span className="font-mono text-xs">CSOAKFLKSNKJA</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spend :</span> <span>€ 0</span>
              </div>
              <div className="flex justify-between">
                <span>Total Orders :</span> <span>0</span>
              </div>
            </div>
          </section>

          {/* <section className="border border-gray-400 rounded-lg p-6">
            <h3 className="text-md font-semibold mb-4">New Customer Profile Preview</h3>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Customer"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">
                {formData.customerName || "Customer Name"}
              </p>
              <p className="text-xs text-gray-500">
                {formData.email || "email@example.com"}
              </p>
            </div>
          </section> */}
        </div>

        {/* Save Button */}
        <hr className="text-gray-400" />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;



// this live event detail code 

import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faTrashCan,
  faArrowRotateLeft,
  faPen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function EventDetail() {
  const navigate = useNavigate();
  // const { eventId }  = useParams(); // Dynamic event ID
    const eventId = "68d4eb61214696b45e3d6e25";
  console.log(eventId);

  const [event, setEvent] = useState(null);
  const [hostImage, setHostImage] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


   useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://la-dolce-vita.onrender.com/api/event/event-details/${eventId}`
        );

        if (response.data.success && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch event.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);


  const handleHostChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      hostInformation: { ...prev.hostInformation, [name]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(`https://your-api.com/events/${eventId}`);
      if (response.status === 200) {
        alert("Event deleted successfully!");
        navigate("/tiktok");
      } else {
        alert(`Failed to delete event: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading event details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!event) return null;

  return (
    <div>
      <Navbar heading="TikTok Live Event Management" />

      {/* Top buttons */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Live Events Details</h1>
        <div className="">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-3 py-1 border rounded-md ${
              isDeleting ? "bg-gray-300 text-gray-500" : "text-[#B21E1E] bg-red-50 hover:bg-red-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrashCan} className="px-2" />
            {isDeleting ? "Deleting..." : "Delete live event"}
          </button>

          <button
            onClick={() => navigate("/update-event")}
            className="mx-2 px-3 py-1 border rounded-md text-[#114E9D] bg-blue-50 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="px-2" />
            Update
          </button>

          <button
            onClick={() => navigate("/tiktok")}
            className="px-3 py-1 border rounded-md text-white bg-[#02B978] hover:bg-[#04D18C]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white px-2" />
            Back to Main View
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-5 p-6 space-y-6">
        {/* Event Details */}
        <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-700">Event Name</h2>
            <p className="text-lg font-medium mt-1">{event.eventDetails.eventName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Event description</h3>
            <textarea
              className="w-full h-35 mt-2 border border-gray-400 rounded-md p-3 text-sm bg-gray-100 resize-none"
              value={event.eventDetails.eventDescription}
              readOnly
            ></textarea>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm pt-2">
            <div>
              <p className="font-medium text-gray-700">Status</p>
              <span className="inline-block mt-3 px-4 py-1 rounded-full border border-orange-400 text-orange-600 bg-orange-50 text-xs font-medium">
                {event.eventDetails.status}
              </span>
            </div>

             <div>
              <p className="font-medium text-gray-700">Session ID</p>
              <p className="mt-3 text-gray-800">{new Date(event.startDateTime).toLocaleString()}</p>
            </div>


            <div>
              <p className="font-medium text-gray-700">Start Date & Time</p>
              <p className="mt-3 text-gray-800">{new Date(event.startDateTime).toLocaleString()}</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">End Date & Time</p>
              <p className="mt-3 text-gray-800">{new Date(event.endDateTime).toLocaleString()}</p>
            </div>

             <div>
              <p className="font-medium text-gray-700">TikTok live Event Link</p>
              <p className="mt-3 text-gray-800">{new Date(event.eventLink).toLocaleString()}</p>
            </div>

          </div>
        </div>

        {/* Host Information */}
        <section className="border border-gray-400 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Host information</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-15 h-15">
              <img
                src={hostImage}
                alt="Host avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
              <label
                htmlFor="hostImageUpload"
                className="absolute bottom-9 right-0 bg-gray-50 px-1 text-black rounded-full cursor-pointer hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faPen} size="sm" />
              </label>
              <input
                id="hostImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <p className="font-semibold">{event.hostInformation.hostName}</p>
              <p className="text-sm text-gray-500">{event.hostInformation.hostEmailAddress}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hostName">Host name*</label>
              <input
                type="text"
                id="hostName"
                name="hostName"
                value={event.hostInformation.hostName}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="emailAddress">Email address*</label>
              <input
                type="email"
                id="emailAddress"
                name="hostEmailAddress"
                value={event.hostInformation.hostEmailAddress}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">Phone Number</label>
              <input
                type="number"
                id="phoneNumber"
                name="hostPhoneNumber"
                value={event.hostInformation.hostPhoneNumber}
                onChange={handleHostChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


//this is update order code 
import React, { useState , useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const [orderData, setOrderData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
    paymentStatus: "",
    shippingMethod: "",
    shippingStatus: "",
  });

  const [orderItems, setOrderItems] = useState([
    { product: "", quantity: 1, price: 0 },
  ]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.id]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addProduct = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1, price: 0 }]);
  };

  const removeProduct = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...orderData, orderItems };
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, payload);
      alert("Order updated successfully!");
      navigate("/Orders");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  
 // Calculate order summary dynamically
  const summary = useMemo(() => {
    const subTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subTotal * 0.1; // 10% tax example
    const discount = subTotal * 0.05; // 5% discount example
    const shippingFee = subTotal > 100 ? 0 : 5; // free shipping over €100
    const total = subTotal + tax + shippingFee - discount;
    return { subTotal, tax, discount, shippingFee, total };
  }, [orderItems]);

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* Discard Button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Order</h1>
        <button
          onClick={() => navigate("/Orders")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <form
        className="max-w-6xl mx-6 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-700"
        onSubmit={handleUpdate}
      >
        {/* Customer Info */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Customer Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="customerName" className="block mb-1 text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <input
                required
                id="customerName"
                type="text"
                value={orderData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                required
                id="email"
                type="email"
                value={orderData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-600">
                Phone number
              </label>
              <input
                required
                id="phone"
                type="number"
                value={orderData.phone}
                onChange={handleChange}
                placeholder="+122 2313 3212"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-600">
                Shipping address
              </label>
              <input
                required
                id="address"
                type="text"
                value={orderData.address}
                onChange={handleChange}
                placeholder="123, main city, state, 12323"
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="border border-gray-400 rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-semibold">Order Items</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 bg-green-600 text-white text-[12px] font-semibold px-3 py-2 rounded-lg hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faPlus} /> Add product
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-3 border-b border-gray-400 last:border-b-0">
              <div className="md:col-span-5">
                <select
                  required
                  value={item.product}
                  onChange={(e) => handleProductChange(idx, "product", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-2 py-2 text-sm"
                >
                  <option value="">Select product</option>
                  <option>Product A</option>
                  <option>Product B</option>
                  <option>Product C</option>
                </select>
              </div>
              <div className="md:col-span-1 text-center">
                <input
                  required
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleProductChange(idx, "quantity", parseInt(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div className="md:col-span-2 text-center">
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleProductChange(idx, "price", parseFloat(e.target.value))}
                  className="w-full text-center rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div className="md:col-span-2 text-center text-sm">
                € {(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button type="button" onClick={() => removeProduct(idx)} className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100">
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Payment Details */}
      <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="paymentMethod"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Payment Method
          </label>
          <select
             required
            id="paymentMethod"
            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option>Select Payment method</option>
            <option>Credit Card</option>
            <option>Paypal</option>
            <option>Bank Transfer</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="paymentStatus"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Payment Status
          </label>
          <select
            required
            id="paymentStatus"
            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option>Select payment status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="border border-gray-400 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="shippingMethod"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Shipping Method
          </label>
          <select
            required
            id="shippingMethod"
            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option>Select Shipping method</option>
            <option>Flat Rate</option>
            <option>Free Shipping</option>
            <option>Local Pickup</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="shippingStatus"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Shipping Status
          </label>
          <select
            required
            id="shippingStatus"
            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option>Select shipping status</option>
            <option>Shipped</option>
            <option>Processing</option>
            <option>Delivered</option>
          </select>
        </div>
      </section>

      
         {/* Order Summary */}
          
        {/* Order Summary */}
        <section className="border border-gray-400 rounded-lg p-4 w-full sm:w-80">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">Order Summary</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>€ {summary.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>€ {summary.tax.toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Discount (5%)</span>
              <span>€ {summary.discount.toFixed(2)}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>€ {summary.shippingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-400 mt-5 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>€ {summary.total.toFixed(2)}</span>
            </div>
          </div>
        </section>



        <hr className="text-gray-500" />
        <div className="flex justify-end">
          <button type="submit" className="bg-[#114E9D] text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-blue-500">
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;




// view customer code 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBan, faTimes, faLocationDot, faArrowLeft , faTrashCan, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

/* -------------------- Shared Components -------------------- */

const STATUS_STYLES = {
  active: "text-green-700 bg-green-100 border-green-700",
  pending: "text-orange-600 bg-orange-100 border-orange-600",
  paid: "text-green-600 bg-green-100 border-green-600",
  failed: "text-red-600 bg-red-100 border-red-600",
  delivered: "text-green-600 bg-green-100 border-green-600",
  shipped: "text-blue-600 bg-blue-100 border-blue-600",
  cancelled: "text-red-600 bg-red-100 border-red-600",
  default: "text-gray-600 bg-gray-100 border-gray-600",
};

const StatusBadge = ({ status }) => {
  const normalized = status.toLowerCase();
  const classes = STATUS_STYLES[normalized] || STATUS_STYLES.default;

  return (
    <span className={`text-xs font-semibold px-3 py-2 rounded-full border ${classes}`}>
      {status}
    </span>
  );
};

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#02B978] peer-focus:ring-4 peer-focus:ring-[#04D18C] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  </div>
);

const BUTTON_VARIANTS = {
  danger: "bg-[#B21E1E] text-white border-red-600 pr-5 hover:bg-red-700",
  default: "bg-white text-gray-700 border-gray-400 pr-10  hover:bg-gray-100",
};

const ActionButton = ({ children, onClick, variant = "default" }) => {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors";
  return (
    <button onClick={onClick} className={`${baseClasses} ${BUTTON_VARIANTS[variant]}`}>
      {children}
    </button>
  );
};

/* -------------------- Main Component -------------------- */

const ViewCustomer = () => {

    const navigate = useNavigate();

  const [emailMarketing, setEmailMarketing] = useState(true);
  const [smsMarketing, setSmsMarketing] = useState(true);

  const orders = [
    {
      id: 1,
      productName: "Classic White Sneakers 1231",
      productImage: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
      paymentStatus: "Pending",
      deliveryStatus: "Delivered",
      price: "€ 12.99",
    },
    {
      id: 2,
      productName: "Classic White Sneakers 1231",
      productImage: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
      paymentStatus: "Paid",
      deliveryStatus: "Shipped",
      price: "€ 12.99",
    },
    {
      id: 3,
      productName: "Classic White Sneakers 1231",
      productImage: "https://uspoloassn.in/cdn/shop/files/1_b38f1b29-bdee-4078-8f72-1507aad69aa7.jpg",
      paymentStatus: "Failed",
      deliveryStatus: "Cancelled",
      price: "€ 12.99",
    },
  ];

  const handleCancelOrder = (id) => {
    alert(`Cancel order with id: ${id}`);
  };

  return (

    <div>

        <Navbar heading="Customer Management"/>

         {/* discard button */}
              <div className="flex justify-between mt-5 mx-10">
                   <h1 className="  font-medium  text-lg">Customer Profile</h1>
        
                {/* <button onClick={() => navigate("/Customers")} className=" px-3 mx-5 lg:mr-30 py-1 border  text-white bg-[#02B978] rounded-md hover:bg-[#04D18C]">
                  <FontAwesomeIcon icon={faArrowLeft} size="md" className="px-2" />  
                  Back to Main View
                </button> */}

                  <div className="">
                           <button onClick={() => navigate("/Customers")} className=" px-3 py-1 border rounded-md  text-[#B21E1E] bg-red-50  hover:bg-red-100">
                                   <FontAwesomeIcon icon={faTrashCan}  className=" px-2" />  
                                   Delete customer
                          </button>
                
                           <button onClick={() => navigate("/update-customer")} className="mx-2 px-3 py-1 border rounded-md  text-[#114E9D] bg-blue-50  hover:bg-blue-100">
                                   <FontAwesomeIcon icon={faArrowRotateLeft}  className=" px-2" />  
                                   Update
                          </button>
                
                           <button onClick={() => navigate("/Customers")} className=" px-3 py-1 border rounded-md  text-white bg-[#02B978]  hover:bg-[#04D18C]">
                                   <FontAwesomeIcon icon={faArrowLeft}  className="text-white px-2" />  
                                   Back to Main View
                          </button>
                        </div>
              </div>

    <div className="p-4 mx-auto space-y-6">
      {/* Top Section: Profile & Preferences */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-4 ">
        
        {/* Customer Profile Card */}
        <div className=" border border-gray-400 rounded-2xl p-6   ">
          <div className="flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Customer Avatar"
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="font-medium text-lg">James Smith</h2>
            <p className="text-gray-900 text-sm mt-2 mb-4">jamesimth14@gmail.com</p>
            <hr className="w-full border-gray-400 mb-4" />

            <div className="w-full space-y-2 text-sm">
              <div className="flex py-2 justify-between">
                <span>Status :</span>
                <StatusBadge status="Active" />
              </div>
              <div className="flex justify-between">
                <span>Customer ID :</span>
                <span className="font-mono">CSOAKFLKSNKJA</span>
              </div>
              <div className="flex py-2 justify-between">
                <span>Avg Order Value :</span>
                <span>€ 15.23</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spend :</span>
                <span>€ 28.23</span>
              </div>
              <div className="flex py-2 justify-between">
                <span>Total Orders :</span>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences & Info Card */}
        <div className=" border border-gray-400 rounded-2xl p-6 ">
          <h3 className="font-medium mb-4">Preferences & Info</h3>

          {/* Preferences */}
          <div className="mb-4">
            <ToggleSwitch
              label="Email Marketing :"
              checked={emailMarketing}
              onChange={() => setEmailMarketing(!emailMarketing)}
            />
            <ToggleSwitch
              label="SMS Marketing :"
              checked={smsMarketing}
              onChange={() => setSmsMarketing(!smsMarketing)}
            />
            <div className="flex justify-between text-sm mb-1">
              <span>Date Joined :</span>
              <span>15/03/2024</span>
            </div>
            <div className="flex py-2 justify-between text-sm mb-4">
              <span>Last Login :</span>
              <span>2 hours ago</span>
            </div>
          </div>

          {/* Quick Actions */}
          <h4 className="font-medium mb-2">Quick Actions</h4>
          <div className="space-y-3 mt-3">

            <ActionButton onClick={() => alert("Add address clicked")}>
              <FontAwesomeIcon icon={faLocationDot} /> Add address
            </ActionButton>

            <ActionButton  onClick={() => alert("Send Email clicked")}>
              <FontAwesomeIcon icon={faEnvelope} /> Send Email
            </ActionButton>

            <ActionButton  variant="danger"  onClick={() => alert("Send Email clicked")}>
             <FontAwesomeIcon icon={faBan} /> Block Customer
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-gray-400 rounded-2xl p-6 mx-4 lg:w-5xl">
        <h3 className="font-medium mb-4">Orders made by customer</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr >
                <th className="py-2 px-3 font-medium">Product Name</th>
                <th className="py-2 px-3 font-medium">Payment Status</th>
                <th className="py-2 px-3 font-medium">Delivery Status</th>
                <th className="py-2 px-3 font-medium">Price</th>
                <th className="py-2 px-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(({ id, productName, productImage, paymentStatus, deliveryStatus, price }) => (
                <tr key={id} className="border-t border-gray-200">
                  <td className="py-2 px-3 flex items-center gap-3">
                    <img src={productImage} alt={productName} className="w-12 h-12 object-cover rounded-md" />
                    <span>{productName}</span>
                  </td>
                  <td className="py-2 px-3">
                    <StatusBadge status={paymentStatus} />
                  </td>
                  <td className="py-2 px-3">
                    <StatusBadge status={deliveryStatus} />
                  </td>
                  <td className="py-2 px-3">{price}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleCancelOrder(id)}
                      className="flex items-center gap-1 text-red-600 border border-red-600 rounded-full px-3 py-1 text-sm hover:bg-red-600 hover:text-white transition"
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    </div>
  );
};

export default ViewCustomer;





// update customer code 

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const {customerId } = useParams();
  const location = useLocation();

  // Pre-fill from state if available
  const existingData = location.state || {};

  const [formData, setFormData] = useState({
    customerName: existingData.name || "",
    email: existingData.email || "",
    phone: existingData.phone || "",
    dob: existingData.dob || "",
    street: existingData.address?.street || "",
    city: existingData.address?.city || "",
    state: existingData.address?.state || "",
    zip: existingData.address?.zip || "",
    country: existingData.address?.country || "Italy",
  });

  const [isActive, setIsActive] = useState(
    existingData.status === "Active" ? true : false
  );
  const [communicationMethod, setCommunicationMethod] = useState(
    existingData.communicationMethod || "email"
  );
  const [marketingPrefs, setMarketingPrefs] = useState({
    offers: existingData.marketingPrefs?.offers || false,
    newsletter: existingData.marketingPrefs?.newsletter || false,
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Toggle marketing preferences
  const handleMarketingChange = (field) => {
    setMarketingPrefs({ ...marketingPrefs, [field]: !marketingPrefs[field] });
  };

  // Submit update API
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      customerName: formData.name, // map properly
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      status: isActive ? "Active" : "Inactive",
      communicationMethod,
      // marketingPrefs, // uncomment and send
    };

    console.log("✅ Payload to send:", payload);

    const res = await axios.put(
      `https://la-dolce-vita.onrender.com/api/user/update-customer/${customerId}`,
      payload
    );

    console.log("✅ Customer updated:", res.data);
    alert("Customer updated successfully!");
    navigate("/Customers");
  } catch (err) {
    console.error("❌ Error updating customer:", err.response || err);
    alert("Failed to update customer. Please try again.");
  }
};


  return (
    <div>
      <Navbar heading="Customer Management" />

      {/* Discard button */}
      <div className="flex justify-between mt-5 mx-10">
        <h1 className="font-medium text-lg">Update Customer Details</h1>
        <button
          onClick={() => navigate("/Customers")}
          className="px-3 py-1 border border-red-700 text-red-700 bg-red-50 rounded-md hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="text-red-700 px-2" />
          Discard
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-6 p-6 space-y-8 font-sans text-gray-700"
      >
        {/* --- Basic Information Section --- */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          {/* Status toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isActive ? "bg-green-400" : "bg-gray-300"
              }`}
              aria-label="Toggle status"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isActive ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1 text-gray-600">
                Customer Name
              </label>
              <input
                required
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-600">
                Email Address
              </label>
              <input
                required
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@email.com"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-600">
                Phone number
              </label>
              <input
                required
                id="phone"
                type="number"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+122 2131 3212"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium mb-1 text-gray-600">
                Date of birth
              </label>
              <input
                required
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* --- Address Section --- */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-4">
          <h3 className="text-md font-semibold">Address</h3>
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Street address
            </label>
            <input
              required
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter street address"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <input
                required
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
              <input
                required
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
              <input
                required
                type="number"
                id="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <select
                required
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option>Italy</option>
                <option>France</option>
                <option>Germany</option>
                <option>USA</option>
              </select>
            </div>
          </div>
        </section>

        {/* --- Preferences Section --- */}
        <section className="border border-gray-400 rounded-lg p-6 space-y-6">
          <h3 className="text-md font-semibold">Preferences</h3>
          <div>
            <label htmlFor="preferredMethod" className="block text-sm font-medium mb-1">
              Preferred Communication Method
            </label>
            <select
              required
              id="preferredMethod"
              value={communicationMethod}
              onChange={(e) => setCommunicationMethod(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>email</option>
              <option>phone</option>
              <option>sms</option>
            </select>
          </div>

          <fieldset className="text-sm">
            <h6 className="mb-2 font-medium">Marketing Preferences</h6>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={marketingPrefs.offers}
                onChange={() => handleMarketingChange("offers")}
              />
              <span>Receive offers and promotions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketingPrefs.newsletter}
                onChange={() => handleMarketingChange("newsletter")}
              />
              <span>Subscribe to newsletter</span>
            </label>
          </fieldset>
        </section>

        {/* Save Button */}
        <hr className="text-gray-400" />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#114E9D] text-white font-semibold rounded-lg px-5 py-2 text-sm hover:bg-blue-500"
          >
            Update Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;
