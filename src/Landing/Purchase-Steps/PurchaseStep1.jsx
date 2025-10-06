import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, } from '@fortawesome/free-solid-svg-icons';
import LandingPageNavbar from "../landingPageNavbar";
import Timer from "../Timer";
import FAQ from "../FAQ";
import GetSupport from "../GetSupport";
import Footer from "../Footer";

function PurchaseStep1() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
 

  const handleSearch = () => {
    alert("Search clicked for Product ID: " + productId);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LandingPageNavbar />
      <Timer />

      {/* Header */}
     

      <div className="max-w-4xl mx-auto text-center mt-20  px-6">

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Shop Italian Excellence
        </h1>
        <p className="text-gray-400 mt-2 text-base font-medium">
          Quick Checkout. Minimal steps. Max confidence.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between w-full max-w-md sm:max-w-4xl lg:max-w-4xl mt-10 mx-auto px-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
            1
          </div>
          <span className="mt-2 text-xs sm:text-xs font-semibold text-[#0B1D51]">
            Enter Product Code
          </span>
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold z-10">
            2
          </div>
          <span className="mt-2 text-xs sm:text-sm text-gray-400">
            Account Verification
          </span>
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold z-10">
            3
          </div>
          <span className="mt-2 text-xs sm:text-sm text-gray-400">
            Delivery Options
          </span>
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50"></div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold">
            4
          </div>
          <span className="mt-2 text-xs sm:text-sm text-gray-400">
            Payment Method
          </span>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mt-14 px-6">
        <div className="flex items-center space-x-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-15 w-15 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>

          <div>
            <h2 className="font-semibold text-xl text-gray-900">
              Find Your TikTok Live Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Instantly search by Product ID from Tik Tok Live session
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID : e.g., 2337, 6543"
            className="flex-grow border border-gray-400 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            onClick={handleSearch}
            className="bg-[#0B1D51] text-white rounded-full px-6 py-2 text-base font-medium hover:bg-blue-900 transition"
          >
            Search
          </button>
        </div>
      </div>

     

      {/* Continue button */}
      <div className="max-w-4xl mx-auto px-6 flex justify-center mt-20">
        <button
          onClick={() => navigate("/choose-item/step-2")}
          className="bg-[#0B1D51] text-white rounded-full px-6 py-2 text-base font-medium hover:bg-blue-900 transition"
        >
          Continue to login <FontAwesomeIcon className='pl-2' icon={faArrowRight} />
        </button>
      </div>

      <FAQ />
      <GetSupport />
      <Footer />
    </div>
  );
}

export default PurchaseStep1;
