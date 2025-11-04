import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function LiveOrder() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState("");

  // 🔹 Fetch Live TikTok Orders
  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await axios.get(
          "https://dev-api.payonlive.com/api/event/live-event-orders"
        );

        if (res.data?.success && Array.isArray(res.data.orders)) {
          // ✅ Only take the top 4 latest orders
          const latestOrders = res.data.orders.slice(0, 4);
          setOrders(latestOrders);
        } else {
          setError("No live orders found.");
        }
      } catch (err) {
        console.error("❌ Error fetching live orders:", err);
        setError("Failed to load live orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchLiveOrders();
  }, []);

  // 🔹 Fetch Weekly Sales Trend
  useEffect(() => {
    const fetchSalesTrend = async () => {
      try {
        const res = await axios.get(
          "https://dev-api.payonlive.com/api/order/week-orders"
        );

        const formattedData =
          res.data?.dailySales?.map((item) => ({
            day: item.day.slice(0, 3),
            sales: item.count || 0,
          })) || [];

        setSalesData(formattedData);
      } catch (error) {
        console.error("❌ Failed to fetch weekly order data:", error);
      }
    };

    fetchSalesTrend();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
      {/* === TikTok Live Orders === */}
      <div className="lg:col-span-3 bg-white shadow-lg rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">TikTok Live Orders</h2>
          <button className="text-sm text-blue-500 hover:underline">
            View all
          </button>
        </div>

        {/* Loading / Error / Orders */}
        {loadingOrders ? (
          <p className="text-center text-gray-500">Loading live orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No live orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const product = order.orderItems?.[0]?.productId || {};
              const productName = product.productName || "Unnamed Product";
              const productCode = product.productCode || "N/A";
              const productImage =
                product.images?.[0] ||
                "https://via.placeholder.com/50?text=No+Image";

              return (
                <li
                  key={order._id}
                  className="flex items-center justify-between pb-2 border-b border-gray-100"
                >
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-10 h-10 border rounded-lg border-gray-300 object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {productName} 
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <button
                    className={`px-3 py-1 text-xs rounded-full border ${
                      order.shippingStatus === "Delivered"
                        ? "bg-green-100 text-green-600 border-green-300"
                        : order.shippingStatus === "Shipped"
                        ? "bg-blue-100 text-blue-600 border-blue-300"
                        : order.shippingStatus === "Processing"
                        ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                        : "bg-orange-100 text-orange-700 border border-orange-300"
                    }`}
                  >
                    {order.shippingStatus}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* === Analytics Chart === */}
      <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-medium mb-4">Analytics</h2>

        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#02B978" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Loading weekly sales data...
          </p>
        )}
      </div>
    </div>
  );
}
