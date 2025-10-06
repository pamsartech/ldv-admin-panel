import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck,  faAngleRight,} from "@fortawesome/free-solid-svg-icons";
import LandingPageNavbar from "../landingPageNavbar";
import Timer from "../Timer";
import FAQ from "../FAQ";
import GetSupport from "../GetSupport";
import Footer from "../Footer";

export default function PurchaseStep4() {
  const [gift, setGift] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);


  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_4gM00j0G31Zq6p47Jx3gk00";
  

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

      <div className="flex items-center justify-between w-full max-w-md sm:max-w-2xl lg:max-w-4xl mt-10 mx-auto px-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-[#0B1D51]">
            Enter Product Code
          </span>

          {/* Line */}
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          {/* <span className="mt-2 text-xs sm:text-sm text-[#B21E1E]">Account Verification</span> */}
          <span className="mt-2 text-xs md:text-sm font-semibold text-[#0B1D51]">
            Account Verification
          </span>

          {/* Line */}
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center flex-1 relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold z-10">
            3
          </div>
          <span className="mt-2 text-xs md:text-sm font-semibold text-[#0B1D51]">
            Delivery Options
          </span>

          {/* Line */}
          <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50"></div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B21E1E] text-white flex items-center justify-center font-semibold">
            4
          </div>
          <span className="mt-2 text-xs md:text-sm font-semibold text-[#B21E1E]">
            Payment Method
          </span>
        </div>
      </div>

      {/* choose payment text */}

      <div className="max-w-md mx-auto mt-14 px-12">
        <div className="flex items-center mx-auto space-x-5">
          {/* Magnifying glass icon */}
          <img
            className="h-20 w-20"
            src="/icons/Payment-Processed.png"
            alt="img"
          />

          <div>
            <h2 className="font-semibold text-xl text-gray-900">
              Secure payment
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Complete your purchase with Stripe
            </p>
          </div>
        </div>
      </div>

      {/* secure payment */}
      <div className="flex justify-center items-start  bg-gray-50 py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  max-w-6xl w-full">
          {/* 1. Review Your Order */}
          <div className="bg-white rounded-xl h-fit shadow-sm p-5">
            <h2 className="font-medium text-base mb-4">
              1. Review Your Order (2 Items)
            </h2>

            {/* Item 1 */}
            <div className="flex items-center justify-between  pb-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdLvRPB8jAhrXJmieaFBwe3vkBthfFTCg7EA&s"
                  alt="item"
                  className="w-18 h-18 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-800 mt-1 text-sm">
                    Luggage mens leather
                  </h3>
                  <p className="text-xs mt-2 text-gray-500">Colour: black</p>
                  <p className="text-xs mt-1 text-gray-500">Size: M</p>
                  <p className="text-xs mt-1 text-gray-500">Quantity: 1</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button className="text-gray-400 hover:text-red-500 mt-2 mb-8 text-xs">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <span className="font-semibold mt-5 text-sm">€15</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between  pb-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPnT3ZrwNNe28RC0NkCl11H3HVat2A0AufBw&s"
                  alt="item"
                  className="w-18 h-18 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-800 mt-1 text-sm">
                    Luggage mens leather
                  </h3>
                  <p className="text-xs mt-2 text-gray-500">Colour: black</p>
                  <p className="text-xs mt-1 text-gray-500">Size: M</p>
                  <p className="text-xs mt-1 text-gray-500">Quantity: 1</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button className="text-gray-400 hover:text-red-500 mb-5 text-xs">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <span className="font-semibold mt-8 text-sm">€15</span>
              </div>
            </div>

            {/* Delivery cost (flex row) */}
            <div className="flex items-center justify-between mt-5 text-black text-sm">
              <span className="font-medium">Chronopost Express delivery</span>
              <span>€6</span>
            </div>

            {/* Divider line under delivery cost (the line you missed) */}
            <div className="border-t border-black my-3" />

            {/* Subtotal */}
            <p className="font-semibold text-gray-800 mt-5 text-sm flex items-center justify-between">
              <span className="text-medium">SUBTOTAL</span>
              <span>€30</span>
            </p>

            {/* Gift Option */}
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                checked={gift}
                onChange={() => setGift(!gift)}
                className="mt-1 w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
              />
              <label className="ml-2 text-sm text-black pl-1">
                Is this a gift?
                <br />
                <span className="text-xs text-gray-400">
                  If so we won’t include your invoice in the package.
                </span>
              </label>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-medium text-black text-base mb-2">
              2. Delivery Address
            </h2>
            <p className="text-xs text-black mb-4">(All fields required)</p>

            <form className="space-y-3">
              <input
                type="text"
                placeholder="First name"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <input
                type="text"
                placeholder="Delivery Address"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <input
                type="text"
                placeholder="State"
                className="w-full border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="City"
                  className="w-1/2 border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  className="w-1/2 border border-gray-400 rounded-full px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-300"
                />
              </div>

              {/* Save Info */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={() => setSaveInfo(!saveInfo)}
                  className="w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
                />
                <label className="ml-2 text-sm text-black">
                  Save this information for next time
                </label>
              </div>

              {/* Same Address */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={() => setSameAddress(!sameAddress)}
                  className="w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
                />
                <label className="ml-2 text-sm text-black">
                  Same as billing address
                </label>
              </div>
            </form>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-xl h-fit shadow-sm p-5">
            <h2 className="font-medium text-black text-base mb-4">
              3. Select payment method
            </h2>

            {/* Stripe */}
            <div   onClick={() => (window.location.href = STRIPE_PAYMENT_LINK)}
             className="flex border border-gray-400 rounded-xl p-3  cursor-pointer">

              <img className="h-5 w-5" src="/icons/stripe-icon.png" alt="img" />
              <span className="font-semibold text-gray-600 text-start px-2 text-sm">
                Stripe
              </span>
              <FontAwesomeIcon
                className="text-end ml-auto text-gray-600"
                icon={faAngleRight}
              />
            </div>

            {/* PayPal */}
            <div className="flex  border border-gray-400 rounded-xl p-3 cursor-pointer">
              <img className="h-5 w-5" src="/icons/paypal-logo.png" alt="img" />
              <span className="font-semibold text-gray-600 px-2 text-sm">
                PayPal
              </span>
              <FontAwesomeIcon
                className="text-end ml-auto text-gray-600"
                icon={faAngleRight}
              />
            </div>
          </div>
        </div>
      </div>

      <FAQ />
      <GetSupport />
      <Footer />
    </div>
  );
}