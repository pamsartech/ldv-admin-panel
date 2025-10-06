import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faHeadset } from "@fortawesome/free-solid-svg-icons";

export default function GetSupport() {
  return (

    <div>

    <section className="bg-white shadow-md rounded-xl p-8 max-w-5xl mx-auto my-10">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Get <span className="text-[#B21E1E]">Support</span>
        </h2>
        <p className="text-black mt-3 max-w-3xl mx-auto">
          Need help with your order, have questions about our live sessions, or
          want to provide feedback? We’re here to help with your Italian
          shopping experience!
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Left - Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Your name*
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-400 focus:border-red-500 outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Email*
            </label>
            <input
              type="email"
              className="w-full border-b border-gray-400 focus:border-red-500 outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Phone*
            </label>
            <input
              type="tel"
              className="w-full border-b border-gray-400 focus:border-red-500 outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Message*
            </label>
            <textarea
              rows="3"
              className="w-full border-b border-gray-400 focus:border-red-500 outline-none py-2 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#235418] text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition"
          >
            Send a message
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>

        {/* Right - Info */}
        <div className=" justify-between items-start md:items-center mt-5 text-gray-700">
          <div className="space-y-4 text-sm font-medium  md:text-base text-center">
            <p> Get reply within 24hrs</p>
            <p> Talk with real humans not bots</p>
            <p> No question is too small – we’re here for you</p>
          </div>

          <div className="mt-20 ">
            <img className="h-40 w-40 mx-auto" src="/icons/image 10.png" alt="" />
          </div>
        </div>
      </div>
     
    </section>

    {/* subscribe section */}
      <div className="text-center py-4 mt-20">
    
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900"> 
        Never Miss a
        <span className="text-[#B21E1E]"> Deal </span>
      </h2>
      <p className="text-gray-600 mt-3 px-2 max-w-3xl mx-auto">
        Subscribe to our newsletter for exclusive pre-sales, special discounts, and early access to new
product launches
      </p>

    {/* search bar */}
    {/* <div className="flex items-center bg-white rounded-full shadow-lg max-w-md px-2 py-2  mx-auto mt-10">
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-grow text-black px-8 py-2  placeholder-black focus:outline-none"
      />
      <button className="flex items-center gap-2 bg-red-700 text-white rounded-full px-3 py-2 hover:bg-red-800 transition">    
        Subscribe
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div> */}

    {/* <div className="flex items-center bg-white rounded-full shadow-lg max-w-md px-2 py-2 mx-auto mt-10">
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-grow text-black px-8 py-2  placeholder-black focus:outline-none"
      />

     <button className="flex items-center text-xs md:text-lg gap-2 bg-red-700 text-white rounded-full px-3 py-2 hover:bg-red-800 transition">
       Subscribe
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
   
    </div> */}

     <div className="bg-white rounded-full shadow-lg max-w-md w-full px-2 py-1 mx-auto mt-10 flex flex-col sm:flex-row items-center gap-2">
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-grow w-full sm:w-auto text-black px-4 py-2 rounded-full placeholder-black focus:outline-none"
      />
    
      <button className="flex items-center justify-center text-sm sm:text-base gap-2 bg-red-700 text-white rounded-full px-4 py-2 hover:bg-red-800 transition w-full sm:w-auto">
        <FontAwesomeIcon icon={faPaperPlane} />
        Notify Me
      </button>
    </div>
 

   </div>
    
    </div>
  );
}
