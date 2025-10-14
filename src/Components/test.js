import React, { useState } from "react";
import Navbar from "../Components/Navbar";
// import TopButton from "../Components/TopButton";
import { useNavigate } from "react-router-dom";
import OrdersDataTable from "../Components/OrderDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDownload,
  faUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function Orders() {

  const navigate = useNavigate();

  

  return (
    <div>
      <Navbar heading="Order Management" />

      {/* my order panel */}
      <div className="flex items-center justify-between px-6 mt-5  pb-3">
        {/* Left Section - Title */}
        <h2 className="text-lg font-semibold text-gray-800"> My Order </h2>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2">
          {/* Import Input (File Upload) */}
          <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
            Import
            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
          </label>

          {/* Export Input (Button) */}
          <label className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <FontAwesomeIcon icon={faUpload} className="text-gray-600" />
            Export
            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
          </label>

          {/* Add Product Button */}
          <button
            onClick={() => navigate("/create-order")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Add Order
          </button>
        </div>
      </div>

      <OrdersDataTable />
    </div>
  );
}
export default Orders;
