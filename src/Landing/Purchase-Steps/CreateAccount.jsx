import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faPhone, faSms , faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LandingPageNavbar from "../landingPageNavbar";
import FAQ from "../FAQ";
import GetSupport from "../GetSupport";
import Footer from "../Footer";

function CreateAccount() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    streetName: '',
    state: '',
    city: '',
    postalCode: '',
    acceptTerms: false,
    receivePromos: false,
    saveInfo: false,
    sameAsBilling: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Form submitted:', formData);
  };

  return (

     <div>

        <LandingPageNavbar />

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
               {/* <div className="flex items-center justify-center w-1/2 mt-15 mx-auto space-x-6"> */}
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
          <img className='h-20 w-20' src="icons/security-shield.png" alt="img" />

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
          

    {/* sign up form */}
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">

        
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Left Section */}
          <div className="flex-1 border border-gray-300 rounded-lg p-6 mb-6 md:mb-0">
            <h2 className="font-medium mb-4">1. Enter Details to complete account creation</h2>
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 my-4 px-3">
              Password must be 8 character long with special symbol (#$) and number(0)
            </p>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the general conditions of the sale.
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="receivePromos"
                name="receivePromos"
                checked={formData.receivePromos}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="receivePromos" className="text-sm text-gray-700">
                receive promotional offers and Newsletter.
              </label>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 border border-gray-300 rounded-lg p-6">
            <h2 className="font-medium mb-4">2. Delivery Address (All fields required)</h2>
            <input
              type="text"
              name="streetName"
              placeholder="Street Name"
              value={formData.streetName}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-full py-2 px-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className=" flex-1  space-x-4 mb-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="flex-1 border border-gray-400 rounded-full py-2 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={handleChange}
                className="flex-1 border my-2 border-gray-400 rounded-full py-2 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="saveInfo"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="saveInfo" className="text-sm text-gray-700">
                Save this information for next time
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sameAsBilling"
                name="sameAsBilling"
                checked={formData.sameAsBilling}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
                Same as billing address
              </label>
            </div>
          </div>
        </div>

   <div className='flex justify-center'>
         <button
          type="submit"
          className=" px-30  md:px-40 bg-[#0B1D51] text-white rounded-full py-3 font-medium mb-4 hover:bg-blue-800 transition-colors" >
          Sign up
        </button>
   </div>
        

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have a account?{' '}
          <button onClick={() => navigate("/choose-item/step-2")} className="font-semibold text-blue-900 hover:underline">
            login
          </button>
        </p>

      <div className='flex justify-center'>

      
        <button onClick={() => navigate("/choose-item/step-2")}
          type="button"
          className="mt-4 px-30 md:px-40 bg-gray-200 text-gray-700 rounded-full py-3 font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
        >          
          <FontAwesomeIcon className='px-2' icon={faArrowLeft} />
          Back
        </button>
     </div>

      </form>
    </div>

    <FAQ />
    <GetSupport />
    <Footer />
    </div>
  );
}

export default CreateAccount;
