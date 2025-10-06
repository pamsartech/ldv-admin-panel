import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faEnvelope, faPhone, faSms } from '@fortawesome/free-solid-svg-icons';
import LandingPageNavbar from "../landingPageNavbar";
import Timer from '../Timer';
import FAQ from "../FAQ";
import GetSupport from "../GetSupport";
import Footer from "../Footer";

function PurchaseStep2 () {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Clear inputs when switching tabs
    setEmail('');
    setMobile('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      console.log('Login with Email:', email);
    } else {
      const mobileRegex = /^[0-9]+$/;
      if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid mobile number (digits only).');
        return;
      }
      console.log('Login with Mobile:', mobile);
    }
  };

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

      {/* 1st Progress Indicator */}
     {/* <div className="flex items-center justify-center w-1/2 mt-10 mx-auto space-x-6"> */}
      {/* Step 1 */}
      {/* <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#0B1D51] text-white flex items-center justify-center font-semibold">
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <span className="mt-3 text-sm font-semibold text-[#0B1D51]">Enter Product Code</span>
      </div> */}

      {/* Line */}
      {/* <div className="flex-1 h-0.5 bg-black/50 mb-4"></div> */}

      {/* Step 2 */}
      {/* <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#B21E1E] text-white flex items-center justify-center font-semibold">
          2
        </div>
        <span className="mt-3 text-sm font-semibold text-[#B21E1E]">Account Verification</span>
      </div> */}

      {/* Line */}
      {/* <div className="flex-1 h-0.5 bg-black/50 mb-4"></div> */}

      {/* Step 3 */}
      {/* <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold">
          3
        </div>
        <span className="mt-3 text-sm text-gray-400">Delivery options</span>
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
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B21E1E] text-white flex items-center justify-center font-semibold z-10">
      2
    </div>
    {/* <span className="mt-2 text-xs sm:text-sm text-[#B21E1E]">Account Verification</span> */}
    <span className="mt-2 text-xs md:text-sm font-semibold text-[#B21E1E]">Account Verification</span>

    {/* Line */}
    <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-black/50 "></div>
  </div>

  {/* Step 3 */}
  <div className="flex flex-col items-center text-center flex-1 relative">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold z-10">
      3
    </div>
    <span className="mt-2 text-xs sm:text-sm text-gray-400">Delivery Options</span>

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


    {/* login text */}
 
    <div className='max-w-md mx-auto mt-14 px-10'>
    <div className="flex items-center mx-auto space-x-5">
          {/* Magnifying glass icon */}
          <img className='h-20 w-20' src="/icons/security-shield.png" alt="img" />

          <div>
            <h2 className="font-semibold text-xl text-gray-900">
              Login / Sign Up
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Choose your preferred Verification method
            </p>
          </div>
        </div>
        </div>

   {/* login form */}
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg mt-5 p-6">
      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-md overflow-hidden mb-6">
        <button
          className={`flex-1 py-2 text-center flex items-center justify-center gap-2 ${
            activeTab === 'email' ? 'bg-gray-100 font-semibold' : 'bg-white'
          }`}
          onClick={() => handleTabClick('email')}
          aria-selected={activeTab === 'email'}
          role="tab"
          type="button"
        >
          <FontAwesomeIcon icon={faEnvelope} />
          Email
        </button>
        <button
          className={`flex-1 py-2 text-center flex items-center justify-center gap-2 ${
            activeTab === 'sms' ? 'bg-gray-100 font-semibold' : 'bg-white'
          }`}
          onClick={() => handleTabClick('sms')}
          aria-selected={activeTab === 'sms'}
          role="tab"
          type="button"
        >
          <FontAwesomeIcon icon={faPhone} />
          SMS
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="inputField">
          {activeTab === 'email' ? 'Email Address' : 'Mobile Number'}
        </label>
        <input
          id="inputField"
          type={activeTab === 'email' ? 'email' : 'tel'}
          placeholder={activeTab === 'email' ? 'your@email.com' : 'Your mobile number'}
          value={activeTab === 'email' ? email : mobile}
          onChange={(e) => {
            if (activeTab === 'email') {
              setEmail(e.target.value);
            } else {
              const val = e.target.value;
              if (val === '' || /^[0-9]+$/.test(val)) {
                setMobile(val);
              }
            }
          }}
          className="w-full border border-gray-400 rounded-full py-2 px-4 mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button onClick={() => navigate("/choose-item/step-3")}
          type="submit"
          className="w-full bg-[#0B1D51] text-white rounded-full py-3 font-medium mb-4 hover:bg-blue-800 transition-colors"
        >
          {activeTab === 'email' ? 'Login with Email' : 'Login with SMS'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mb-6">
        New user?{' '}
        <button onClick={() => navigate("/create-account")} className="font-semibold text-blue-900 hover:underline">
          Create an account
        </button>
      </p>

      <button onClick={() => navigate("/choose-item/step-1")}
        type="button"
        className="w-full bg-gray-200 text-gray-700 rounded-full py-3 font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
      >    
         <FontAwesomeIcon className='px-2' icon={faArrowLeft} />
        Back
      </button>
    </div>

    <FAQ />
    <GetSupport />
    <Footer />
</div>
  );
}

export default PurchaseStep2;
