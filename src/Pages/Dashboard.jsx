import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import SellingChart from "../Components/SellingChart";
import LiveOrder from "../Components/LiveOrder";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeTikTokSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ API Endpoints
  const endpoints = {
    totalSales: "https://dev-api.payonlive.com/api/order/sales/today",
    pendingOrders: "https://dev-api.payonlive.com/api/order/pending/count",
    totalProducts: "https://dev-api.payonlive.com/api/product/total",
    activeTikTokSales: "https://dev-api.payonlive.com/api/event/active-Events",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all APIs in parallel
        const [
          totalSalesRes,
          pendingOrdersRes,
          totalProductsRes,
          activeTikTokRes,
        ] = await Promise.all([
          axios.get(endpoints.totalSales),
          axios.get(endpoints.pendingOrders),
          axios.get(endpoints.totalProducts),
          axios.get(endpoints.activeTikTokSales),
        ]);

        setStats({
          totalSales: totalSalesRes.data.totalSales ?? 0,
          pendingOrders: pendingOrdersRes.data.pendingOrderCount ?? 0,
          totalProducts: totalProductsRes.data.totalProducts ?? 0,
          activeTikTokSales: activeTikTokRes.data.totalActiveEvents ?? 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <Navbar heading="Tableau de bord" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Card 1 - Total Sales Today */}
        <div className="p-5 rounded-2xl shadow-md bg-white">
          <span className="text-gray-700">Ventes totales aujourd’hui </span>
          <p className="text-xl mt-7 font-medium">€{stats.totalSales}</p>
          <p className="text-sm mt-7 text-gray-700">
            <span className="text-[#02B978]"> 4%</span>  depuis hier
          </p>
        </div>

        {/* Card 2 - Pending Orders */}
        <div className="p-5 rounded-2xl shadow-md bg-white flex flex-col justify-between">
          <span className="text-gray-700">Commandes en attente</span>
          <p className="text-xl mt-7 font-medium">{stats.pendingOrders}</p>
          <DescriptionOutlinedIcon className="mt-6 text-8xl text-amber-400" />
        </div>

        {/* Card 3 - Total Products */}
        <div className="p-5 rounded-2xl shadow-md bg-white flex flex-col justify-between">
          <span className="text-gray-500">Produits totaux</span>
          <p className="text-2xl font-medium mt-7">{stats.totalProducts}</p>
          <WarningAmberIcon className="mt-6" />
        </div>

        {/* Card 4 - Active TikTok Live Sales */}
        <div className="p-5 rounded-2xl shadow-md bg-white flex flex-col justify-between">
          <span className="text-gray-500">Ventes TikTok Live actives</span>
          <p className="text-2xl font-medium mt-7">{stats.activeTikTokSales}</p>
          <DiscountOutlinedIcon className="mt-6" />
        </div>
      </div>

      {/* Selling Chart */}
      <SellingChart />

      {/* Live Orders */}
      <LiveOrder />
    </div>
  );
}

export default Dashboard;
