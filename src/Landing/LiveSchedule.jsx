import React from "react";
import {
  faBell,
  faPlay,
  faUsers,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function LiveSchedule () {

 

  return (

    <section className="my-10">
        {/* Heading */}
    <div className="text-center">
    
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900"> 
        <span className="text-[#B21E1E]">Live Shopping </span>
         Schedule
      </h2>
      <p className="text-gray-600 mt-3 max-w-3xl mx-auto px-1">
        Never miss authentic Italian products! Set reminders for upcoming live sessions and get notified about exclusive offers and product launches from Italy.
      </p>

    {/* search bar */}
    {/* <div className="flex items-center bg-white rounded-full shadow-lg max-w-md px-2 py-2 mx-auto mt-10">
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-grow text-black px-8 py-3  placeholder-black focus:outline-none"
      />

     <button className="flex items-center gap-2 bg-red-700 text-white rounded-full px-2 py-3 hover:bg-red-800 transition">
      <FontAwesomeIcon icon={faBell} />
        Notify me
      </button>
   
    </div> */}


    {/* <div className=" bg-white rounded-full shadow-lg max-w-md px-2 py-2 mx-auto mt-10">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow text-black px-8 py-2  placeholder-black focus:outline-none"
          />
    
         <button className=" text-xs md:text-lg gap-2 bg-red-700 text-white rounded-full px-3 py-2 hover:bg-red-800 transition">
          <FontAwesomeIcon icon={faBell} />
           Notify Me
            
          </button>
       
        </div> */}

        <div className="bg-white rounded-full shadow-lg max-w-md w-full px-2 py-1 mx-auto mt-10 flex flex-col sm:flex-row items-center gap-2">
  <input
    type="email"
    placeholder="Enter your email address"
    className="flex-grow w-full sm:w-auto text-black px-4 py-2 rounded-full placeholder-black focus:outline-none"
  />

  <button className="flex items-center justify-center text-sm sm:text-base gap-2 bg-red-700 text-white rounded-full px-4 py-2 hover:bg-red-800 transition w-full sm:w-auto">
    <FontAwesomeIcon icon={faBell} />
    Notify Me
  </button>
</div>


        {/* <button className=" w-full text-center mx-4 text-xs md:text-lg gap-2 bg-red-700 text-white rounded-full px-2 py-2 hover:bg-red-800 transition">
          <FontAwesomeIcon icon={faBell} />
           Notify Me
            
          </button> */}
 





   </div>
   

    </section>
  )
}
export default LiveSchedule;