import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleRight,
  faCircleCheck,
  faChartLine,
  faBoxArchive,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@mui/material";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Paid: "bg-green-100 text-green-700 border border-green-300",
  Failed: "bg-red-100 text-red-700 border border-red-300",
  Shipped: "bg-blue-100 text-blue-700 border border-blue-300",
  Processing: "bg-orange-100 text-orange-700 border border-orange-300",
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  Cancelled: "bg-red-100 text-red-700 border border-red-300",
  Dispatched: "bg-purple-100 text-purple-700 border border-purple-300",
  "Out for delivery": "bg-orange-100 text-orange-700 border border-orange-300",
};

export default function OrdersDataTable() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const ordersPerPage = 8;

  const [averageData, setAverageData] = useState({
    averageOrder: 0,
    deliveryRate: "0%",
  });

  // Fetch orders + average data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://dev-api.payonlive.com/api/order/order-list"
        );
        const apiOrders = response.data.orders || response.data.data || [];
        const formattedOrders = apiOrders.map((o) => ({
          id: o._id || "N/A",
          customer: o.customerName || o.customer || "Unknown",
          product:
            o.orderItems && o.orderItems.length > 0
              ? o.orderItems.map((item) => item.productName).join(", ")
              : "N/A",
          payment: o.paymentStatus || "Pending",
          shipping: o.shippingStatus || "Processing",
          amount:
            o.orderItems && o.orderItems.length > 0
              ? o.orderItems.reduce((sum, item) => sum + (item.total || 0), 0)
              : 0,
          date: o.createdAt || "",
          phoneNumber: o.phoneNumber || "unknown",
          transactionId: o.payment_id || o.payment_Id || "unknown",
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAverageData = async () => {
      try {
        const res = await axios.get(
          "https://la-dolce-vita.onrender.com/api/order/orders-average"
        );
        if (res.data.success) {
          setAverageData({
            averageOrder: res.data.averages.lastDay,
            deliveryRate: res.data.deliverySuccessRate.lastDay,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    fetchAverageData();
  }, []);

  // Filter + Sort + Tabs
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer.toLowerCase().includes(lowerSearch) ||
          o.product.toLowerCase().includes(lowerSearch) ||
          o.id.toString().toLowerCase().includes(lowerSearch)
      );
    }
    if (activeTab === "active") {
      result = result.filter(
        (o) => o.payment === "Pending" || o.shipping === "Shipped"
      );
    } else if (activeTab === "archived") {
      result = result.filter(
        (o) => o.shipping === "Delivered" || o.shipping === "Cancelled"
      );
    }
    if (filterPayment !== "all") {
      result = result.filter((o) => o.payment === filterPayment);
    }
    result.sort((a, b) => {
      const nameA = a.customer || "";
      const nameB = b.customer || "";
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    return result;
  }, [orders, activeTab, filterPayment, sortAsc, search]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Skeletons
  const skeletonRows = Array.from({ length: ordersPerPage }).map((_, idx) => (
    <tr key={idx} className="border-b">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton animation="wave" />
        </td>
      ))}
    </tr>
  ));

  const skeletonCard = (
    <div className="bg-white rounded-lg shadow p-6 border">
      <Skeleton animation="wave" variant="text" width="50%" height={30} />
      <div className="flex gap-4 mt-4">
        <Skeleton animation="wave" variant="rectangular" width={50} height={30} />
        <Skeleton animation="wave" variant="rectangular" width={50} height={30} />
        <Skeleton animation="wave" variant="rectangular" width={50} height={30} />
      </div>
    </div>
  );

  const skeletonRightPanel = (
    <div className="col-span-3 bg-white rounded-lg shadow p-6">
      <Skeleton animation="wave" variant="text" width="40%" height={25} />
      <div className="space-y-2 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} animation="wave" variant="text" width="80%" />
        ))}
      </div>
    </div>
  );

  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div>
      {/* Tabs + Filters + Search */}
      <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "all"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} /> All
          </button>
          <button
            onClick={() => {
              setActiveTab("active");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "active"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} /> Active
          </button>
          <button
            onClick={() => {
              setActiveTab("archived");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 text-sm px-2 pb-1 ${
              activeTab === "archived"
                ? "text-black font-medium border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBoxArchive} /> Archived
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={filterPayment}
            onChange={(e) => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
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

      {/* search bar code */}
      <div className="flex gap-2 mx-6 relative mt-5">
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
      </div>

      {/* Orders Table + Right Panel */}
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
                {loading ? (
                  skeletonRows
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.product}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.payment]
                          }`}
                        >
                          {order.payment}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.shipping]
                          }`}
                        >
                          {order.shipping}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="hover:text-black"
                        >
                          <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No matching results
                    </td>
                  </tr>
                )}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-2 lg:w-3xl gap-6 mt-16 mx-auto">
              {loading ? (
                <>
                  {skeletonCard}
                  {skeletonCard}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow p-6 border">
                    <h3 className="font-semibold text-gray-800">
                      TikTok Live Event
                    </h3>
                    <div className="flex gap-8 mt-6 text-sm font-medium text-gray-700">
                      <button className="hover:text-black">Day</button>
                      <button className="hover:text-black">Week</button>
                      <button className="hover:text-black">Month</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6 border flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800 mb-2">
                        Average Order value
                      </h3>
                      <p className="text-2xl font-bold mt-2">
                        €{averageData.averageOrder}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Average Order value
                      </p>
                    </div>

                    <div className="w-px bg-gray-300 h-16 mx-6"></div>

                    <div className="text-sm text-gray-700">
                      <p className="font-medium">Delivery status</p>
                      <p className="mt-8">
                        Delivered :{" "}
                        <span className="font-semibold">
                          {averageData.deliveryRate}
                        </span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right panel */}
          {loading
            ? skeletonRightPanel
            : selectedOrder && (
                <div className="col-span-3 bg-white rounded-lg shadow p-6 transition-all duration-300">
                  {/* Selected Order info panel */}
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-md font-medium">
                      Order {selectedOrder.id}
                    </h2>
                    <button
                      className="underline"
                      onClick={() =>
                        navigate(`/user/view-order/${selectedOrder.id}`)
                      }
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-black"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-gray-700 space-y-2">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Date:</strong> {selectedOrder.date || "20/08/2025"}
                    </p>
                    <p>
                      <strong>Order amount:</strong> € {selectedOrder.amount || "28.23"}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedOrder.payment}
                    </p>
                  </div>

                  <hr className="my-4" />

                  <div className="text-xs text-gray-700 space-y-2">
                    <h3 className="font-bold text-sm text-gray-800">
                      Customer Info
                    </h3>
                    <p>
                      <strong>Name:</strong> {selectedOrder.customer}{" "}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedOrder.customer.toLowerCase()}@gmail.com
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.phoneNumber}
                    </p>
                  </div>

                  <hr className="my-4" />

                  <div className="text-xs text-gray-700 space-y-2">
                    <h3 className="font-bold text-sm text-gray-800">
                      Payment Info
                    </h3>
                    <p>
                      <strong>Method:</strong> Stripe
                    </p>
                    <p>
                      <strong>Status: </strong> {selectedOrder.payment}
                    </p>
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedOrder.transactionId}
                    </p>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
