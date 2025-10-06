import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faArrowLeft , faCheck } from "@fortawesome/free-solid-svg-icons";
import LandingPageNavbar from "../landingPageNavbar";
import Timer from "../Timer";
import FAQ from "../FAQ";
import GetSupport from "../GetSupport";
import Footer from "../Footer";

export default function PurchaseStep3 () {

    const navigate = useNavigate();

  const [selected, setSelected] = useState(true);

  return (

    <div>
        <LandingPageNavbar />
        <Timer />

         {/* Header */}
              <div className="max-w-4xl mx-auto text-center mt-30  px-6">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Shop Italian Excellence
                </h1>
                <p className="text-gray-400 mt-2 text-base font-medium">
                  Quick Checkout. Minimal steps. Max confidence.
                </p>
              </div>
        
              {/* Progress Indicator */}
             {/* <div className="flex items-center justify-center w-1/2 mt-10 mx-auto space-x-6"> */}
              {/* Step 1 */}
              {/* <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <span className="mt-3 text-sm font-semibold text-[#0B1D51]">Enter Product Code</span>
              </div> */}
        
              {/* Line */}
              {/* <div className="flex-1 h-0.5 bg-[#0B1D51] mb-4"></div> */}
        
              {/* Step 2 */}
              {/* <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <span className="mt-3 text-sm font-semibold text-[#0B1D51]">Account Verification</span>
              </div> */}
        
              {/* Line */}
              {/* <div className="flex-1 h-0.5 bg-[#0B1D51] mb-4"></div> */}
        
              {/* Step 3 */}
              {/* <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#B21E1E] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="mt-3 text-sm font-semibold text-[#B21E1E]">Delivery options</span>
              </div> */}
        
              {/* Line */}
              {/* <div className="flex-1 h-0.5 bg-black/50 mb-4"></div> */}
        
              {/* Step 4 */}
              {/* <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold">
                  4
                </div>
                <span className="mt-3 text-sm text-gray-400">Payment</span>
              </div>
            </div> */}


             {/* 2nd progress bar */}
            <div className="flex items-center justify-between w-full max-w-md sm:max-w-2xl lg:max-w-4xl mt-10 mx-auto px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center flex-1 relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
                   <FontAwesomeIcon icon={faCheck} />
                </div>
                <span className="mt-2 text-xs sm:text-sm font-semibold text-[#0B1D51]">Enter Product Code</span>
            
                {/* Line */}
                <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
              </div>
            
            
            
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center flex-1 relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
                   <FontAwesomeIcon icon={faCheck} />
                </div>
                {/* <span className="mt-2 text-xs sm:text-sm text-[#B21E1E]">Account Verification</span> */}
                <span className="mt-2 text-xs md:text-sm font-semibold text-[#0B1D51]">Account Verification</span>
            
                {/* Line */}
                <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
              </div>
            
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center flex-1 relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B21E1E] text-white flex items-center justify-center font-semibold z-10">
                  3
                </div>
                <span className="mt-2 text-xs md:text-sm font-semibold text-[#B21E1E]">Delivery Options</span>
            
                {/* Line */}
                <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50"></div>
              </div>
            
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold">
                  4
                </div>
                <span className="mt-2 text-xs sm:text-sm text-gray-400">Payment Method</span>
              </div>
            </div>
            
        
            {/* choose delivery text */}
         
            <div className='max-w-md mx-auto mt-14 px-12'>
            <div className="flex items-center mx-auto space-x-5">
                  {/* Magnifying glass icon */}
                  <img className='h-20 w-20' src="/icons/cart.png" alt="img" />
        
                  <div>
                    <h2 className="font-semibold text-xl text-gray-900">
                      Choose delivery options
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Select your preferred delivery method
                    </p>
                  </div>
                </div>
                </div>


    {/* delivery location */}
    <div className="flex justify-center items-center mt-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-5">
        {/* Delivery Option */}
        <div
          className={`flex items-center justify-between border-2 shadow-sm rounded-xl p-4 cursor-pointer ${
            selected ? "border-gray-400" : "border-gray-300"
          }`}
          onClick={() => setSelected(true)}
        >
          <div className="flex items-center gap-3">
            {/* Radio Button */}
            <input
              type="radio"
              checked={selected}
              onChange={() => setSelected(true)}
              className="w-4 h-5 text-gray-500 border-gray-300 focus:ring-gray-400 "
            />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
            <div className="px-2">
              <h2 className="font-medium">Mondial Relay</h2>
              <p className="text-gray-500 text-sm">
                Pick up at a relay point near you
              </p>
            </div>
          </div>
          <span className="font-semibold">€5</span>
        </div>

        {/* Map */}
        <div className="mt-4">
          <img
            src="/icons/map img.jpg"
            alt="Map"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Continue Button */}
        <button onClick={() => navigate("/choose-item/step-4")}
         className="w-full mt-6 bg-[#0B1D51] text-white py-3 rounded-full font-medium hover:bg-blue-900 transition">
          Continue to Payment
        </button>

        {/* Back Button */}
        <button onClick={() => navigate("/choose-item/step-2")}
         className="w-full mt-5 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
      </div>
    </div>

      <FAQ />
      <GetSupport />
      <Footer />
    
 </div>
  );
}

