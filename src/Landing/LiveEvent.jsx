import React from "react";
import {
  faBell,
  faPlay,
  faUsers,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core";

const LiveEvent = () => {
  const events = [
    {
      id: 1,
      title: "Italian Fashion Showcase",
      description:
        "Discover the latest from Milan's finest fashion houses with exclusive discounts",
      time: "Today",
      icon: "/icons/tabler_clock.svg",
      timeDetail: "8:00 PM CET",
      host: "Isabella Rossi",
      expected: "2.5K expected",
      category: "Fashion",
    },
    {
      id: 2,
      title: "Italian Fashion Showcase",
      description:
        "Discover the latest from Milan's finest fashion houses with exclusive discounts",
      time: "Today",
      icon: "/icons/tabler_clock.svg",
      timeDetail: "8:00 PM CET",
      host: "Isabella Rossi",
      expected: "2.5K expected",
      category: "Fashion",
    },
    {
      id: 3,
      title: "Italian Fashion Showcase",
      description:
        "Discover the latest from Milan's finest fashion houses with exclusive discounts",
      time: "Today",
      icon: "/icons/tabler_clock.svg",
      timeDetail: "8:00 PM CET",
      host: "Isabella Rossi",
      expected: "2.5K expected",
      category: "Fashion",
    },
  ];

  const features = [
    {
      id: 1,
      icon : "/icons/uil_calender.svg",
      color: "bg-[#DF2020]",
      title: "Smart Reminders",
      desc: "Get notified 15 minutes before each live session starts so you never miss authentic Italian products.",
    },
    {
      id: 2,
      icon: "/icons/line-md_bell.svg",
      color: "bg-[#235418]",
      title: "Weekly Schedule",
      desc: "Regular live sessions throughout the week with different Italian product categories and special events.",
    },
    {
      id: 3,
      icon: "/icons/ph_users-bold.svg",
      color: "bg-[#363D49]",
      title: "Italian Community",
      desc: "Join our community of Italian culture enthusiasts for exclusive previews and early access to authentic products.",
    },
  ];

  return (
   <div className="px-3 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 max-w-6xl mx-auto">
  {/* Header */}
  <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
    See <span className="text-red-600">Tik Tok Live</span> Schedule's
  </h2>
  <p className="text-center text-gray-500 mb-8 text-sm sm:text-base md:text-lg">
    Set a reminder to never miss a live event
  </p>

  {/* Event Cards */}
  <div className="space-y-5 lg:ml-18">
    {events.map((event) => (
      <div
        key={event.id}
        className="bg-white shadow rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
      >
        {/* Left Calendar Icon */}
        <div className="flex items-center gap-3 sm:w-40">
          <img src="icons/uim_calender.svg" alt="" className="w-8 h-8 sm:w-10 sm:h-10" />
          <div className="flex flex-col">
            <p className="text-xs sm:text-sm text-gray-600">{event.time}</p>
            <div className="flex items-center gap-2">
              <img src={event.icon} className="w-3 h-3 " alt="" />
            <p className="text-xs sm:text-sm text-gray-600">{event.timeDetail}</p>
            </div>
            
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 sm:px-4">
          <h3 className="font-bold text-base sm:text-lg md:text-xl">{event.title}</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-2">{event.description}</p>

          {/* Host and Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
            <span>
              <span className="font-semibold">Host:</span> {event.host}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <FontAwesomeIcon icon={faUsers} /> {event.expected}
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs sm:text-sm font-medium">
              {event.category}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button className="flex items-center justify-center gap-2 border px-4 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-100 transition">
              <FontAwesomeIcon icon={faBell} /> Remind Me
            </button>
            <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-green-700 transition">
              <FontAwesomeIcon icon={faPlay} /> Join Live
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Features Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
    {features.map((feature) => (
      <div
        key={feature.id}
        className="bg-white shadow-lg mt-5 rounded-xl p-5 sm:p-6 text-center"
      >
       

        <img className={`${feature.color} px-3 py-3 mx-auto rounded-xl text-2xl sm:text-3xl md:text-4xl`}
        src= {feature.icon}       
        alt="icons" />
         

        <h4 className="font-semibold mt-3 mb-2 text-sm sm:text-base md:text-lg">
          {feature.title}
        </h4>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base">{feature.desc}</p>
      </div>
    ))}
  </div>
</div>


  );
};

export default LiveEvent;


