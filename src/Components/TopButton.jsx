import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faChartLine } from "@fortawesome/free-solid-svg-icons";



function TopButton (props) {

    const [activeTab, setActiveTab] = useState("all");

    return (
    <div>
        {/* 1st panel */}
        <div className="flex justify-between items-center border-2 border-gray-300 px-6 mt-5 rounded-md p-2 mx-6">

      {/* Tabs Section */}
      <div className="flex gap-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 text-sm px-2 pb-1 ${
            activeTab === "all"
              ? "text-black font-medium border-b-2 border-black"
              : "text-gray-600 hover:text-black"
          }`}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          {props.firstNav}
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 text-sm px-2 pb-1 ${
            activeTab === "active"
              ? "text-black font-medium border-b-2 border-black"
              : "text-gray-600 hover:text-black"
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} />
          {props.secondNav}
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={`flex items-center gap-2 text-sm px-2 pb-1 ${
            activeTab === "archived"
              ? "text-black font-medium border-b-2 border-black"
              : "text-gray-600 hover:text-black"
          }`}
        >
          <FontAwesomeIcon icon={props.icon} />
          {props.thirdNav}
        </button>
      </div>

      {/* Filter & Sort */}
      <div className="flex gap-2">
        <button className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition">
      
          <img src="/icons/cuida_filter-outline.svg" alt="icon" />
          Filter
        </button>
        <button className="flex items-center gap-2 border border-gray-400 px-3 py-1.5 rounded-md text-sm text-gray-900 hover:bg-gray-100 transition">
          <img src="/icons/flowbite_sort-outline.svg" alt="icon" />
          Sort
        </button>
      </div>

       </div>

    </div>   
    )
}
export default TopButton;