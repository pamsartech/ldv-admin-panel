import React from "react";
import { useNavigate } from "react-router-dom";


function HeroSection () {

  const navigate = useNavigate();

  return (
    <div className="bg-white mt-20">

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 lg:px-16 py-12 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="order-2 md:order-1">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-snug text-gray-900">
            Authentic <span className="text-[#B21E1E]">Italian</span> <br />
            Fashion, Live & <br /> Exclusive
          </h1>
          <p className="text-gray-600 mt-4 lg:text-2xl">
            Discover authentic
            <img className=" inline-block px-2 mb-1" src="/icons/Flag Italy.svg" alt="" />
            <span className="text-[#B21E1E] font-medium">Italian products </span>
             through our exclusive “TikTok Live sessions”.
          </p>

          <ul className="mt-6 space-y-3 text-black lg:text-lg">
            <li className="flex items-center gap-2">
              <img className="" src="/icons/Flag Italy.svg" alt="" /> Live interactive shopping sessions with Italian artisans
            </li>
            <li className="flex items-center gap-2">
              <img className="" src="/icons/Unlocked.svg" alt="" />
                Secure checkout with fast delivery
            </li>
            <li className="flex items-center gap-2">
              <img className="" src="/icons/Star.svg" alt="" />
              Join 50K+ satisfied customers
            </li>
          </ul>

          <button onClick={() => navigate("/choose-item/step-1")}
           className="mt-8 bg-[#B21E1E] hover:bg-[#8F1818] text-white px-6 py-3 rounded-full font-medium transition">
            Buy your product now
          </button>
        </div>

        {/* Right Image Section */}
        <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/hero-section-img.jpeg"
            alt="Italian Fashion"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

