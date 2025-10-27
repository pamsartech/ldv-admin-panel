import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import TiktokLiveTable from "../Components/TiktokLiveTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function TikTokLive() {

  const navigate = useNavigate();

  return (

    <div>
      <Navbar heading="TikTok Live Events Management" />

      {/* tiktok live event panel */}
      <div className="flex items-center justify-between px-6 mt-5  pb-3">
        {/* Left Section - Title */}
        <h2 className="text-lg font-semibold text-gray-800"> Live Events </h2>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2">
          {/* Add Product Button */}
          <button
            onClick={() => navigate("/user/create-live-event")}
            className="flex items-center gap-2 bg-[#02B978] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#04D18C] transition" >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            Create Live Event
          </button>
        </div>
      </div>

    

      

      {/* tiktok live table */}

      <TiktokLiveTable />

    </div>
  );
}

export default TikTokLive;
