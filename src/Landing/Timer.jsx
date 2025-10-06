import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Timer () {

    const navigate = useNavigate();

     const [timeLeft, setTimeLeft] = useState(600); // 5 minutes = 300 seconds
    
      // Countdown effect
      useEffect(() => {
        if (timeLeft <= 0) return;
    
        const timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(timer);
      }, [timeLeft]);
    
      // Convert seconds into mm:ss format
      const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
      };

    return (
         <div className="mt-20 lg:mt-25 px-10 flex justify-between lg:mx-30">

        <button onClick={() => navigate("/")}
        className="px-4 py-1 border border-gray-300 rounded-full shadow-lg " >
         <FontAwesomeIcon className='pr-2' icon={faArrowLeft} /> Back to home 
        </button>

        <button className="border  border-red-500 rounded-full px-6 py-2 bg-red-500">
          {/* <h3 className="text-xl font-bold text-gray-900 mb-2">
            Time Remaining
          </h3> */}
          <p className="text-2xl font-mono text-white">{formatTime(timeLeft)}</p>
          {/* {timeLeft <= 0 && (
            <p className="mt-4 text-red-600 font-semibold">Time expired!</p>
          )} */}
        </button>
      </div>
    )
}
export default Timer;