import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LiveOrder() {
  // 🔹 Dummy orders data
  const orders = [
    { img: "https://t4.ftcdn.net/jpg/07/57/61/23/360_F_757612374_09Q9dyxOKbynCiT3hMUyk3iEuoR1RgJy.jpg", customer: "Olivia Williams", product: "Red Dress", code: "202035", status: "Shipped" },
    { img: "https://superlawyer.in/wp-content/uploads/2022/10/Divyashree-Suri-Passport-Photo-1.jpeg", customer: "Olivia Williams", product: "Black Hand bag", code: "202085", status: "Paid" },
    { img: "https://www.shutterstock.com/image-photo/passport-photo-portrait-young-man-600nw-2437772333.jpg", customer: "Olivia Williams", product: "Beige heels", code: "202045", status: "Returned" },
    { img: "https://www.shutterstock.com/image-photo/passport-photo-portrait-young-man-600nw-2437772333.jpg", customer: "Olivia Williams", product: "Red Dress", code: "202035", status: "Shipped" },
  ];

  // 🔹 Dummy analytics data
  const data = [
    { day: "Sun", sales: 50 },
    { day: "Mon", sales: 30 },
    { day: "Tue", sales: 45 },
    { day: "Wed", sales: 25 },
    { day: "Thu", sales: 35 },
    { day: "Fri", sales: 60 },
    { day: "Sat", sales: 48 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
      {/* === TikTok Live Orders === */}
      <div className="lg:col-span-3 bg-white shadow-lg rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">TikTok Live Orders</h2>
          <button className="text-sm text-blue-500 hover:underline">View all</button>
        </div>

        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li key={index} className="flex items-center justify-between pb-2">
              {/* Checkbox + Customer Info */}
              <div className="flex items-center gap-3">
                <img src={order.img} className="w-10 h-10 border rounded-lg border-gray-400 " />
                <div>
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-gray-500">
                    {order.product} {order.code}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <button
                className={`px-3 py-1 text-xs rounded-full border ${
                  order.status === "Shipped"
                    ? "bg-green-100 text-green-600 border-green-300"
                    : order.status === "Paid"
                    ? "bg-blue-100 text-blue-600 border-blue-300"
                    : "bg-red-100 text-red-600 border-red-300"
                }`}
              >
                {order.status}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* === Analytics Chart === */}
      <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-medium mb-4">Analytics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#02B978" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
