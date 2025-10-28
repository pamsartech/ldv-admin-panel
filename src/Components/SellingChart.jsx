// src/components/SalesDashboard.jsx
import { useEffect, useState } from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";
import axios
 from "axios";
 function SellingChart() {

  const data = [
    { name: "Sun", sales: 2000 },
    { name: "Mon", sales: 9000 },
    { name: "Tue", sales: 6000 },
    { name: "Wed", sales: 10000 },
    { name: "Thu", sales: 9500 },
    { name: "Fri", sales: 11000 },
    { name: "Sat", sales: 18000 },
  ];

  // ✅ State to store best-selling products (dynamic)
    const [bestSelling, setBestSelling] = useState([]);

    // ✅ Best selling products
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        console.log("📡 Fetching best-selling products...");
        const res = await axios.get(
          "http://dev-api.payonlive.com/api/product/best-selling"
        );
        console.log("Bst selling products:", res.data);
        setBestSelling(res.data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch best-selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {/* Sales Trends */}
      <div className="p-5 shadow-lg rounded-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sales Trends</h3>
          <button className="text-sm text-blue-500 hover:underline">View</button>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line className="text-[#02B978]" type="linear" dataKey="sales" stroke="#05df72" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Products */}
      <div className="p-5 shadow-lg rounded-xl bg-white ">
        <h3 className="text-lg font-medium mb-4">Best-selling Products</h3>
        <ul className="space-y-4">
          {bestSelling.map((product, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={product.productImages?.[0]}
                  alt={product.productCategory || "Product"}
                  className=" w-10 h-10 border-1 rounded-lg border-gray-400"
                />
                <div>
                  <p className="font-medium">{product.productCategory}</p>
                  <p className="text-sm text-gray-500">{product.productCode || 'N/A'}</p>
                </div>
              </div>
              <span className="font-medium">{product.salesStats?.totalQuantitySold || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SellingChart;