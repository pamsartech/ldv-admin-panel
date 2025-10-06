import Navbar from "../Components/Navbar";
import SellingChart from "../Components/SellingChart";
import LiveOrder from "../Components/LiveOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faExclamationTriangle, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';

function Dashboard () {

    return (

     <div className="bg-white">
            {/* this is top navbar */}
           <Navbar heading = "Dashboard" />


      {/* this is cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

      {/* Card 1 - Total Sales */}
      <div className="p-5  rounded-2xl shadow-md bg-white">
        <span className=" text-gray-700">Total Sales Today</span>
        <p className="text-xl mt-7 font-medium">€14,350</p>
        <p className="text-sm mt-7 text-gray-700"> <span className="text-[#02B978]"> € 4% </span>since yesterday</p>
      </div>

      {/* Card 2 - Pending Orders */}
      <div className="p-5  rounded-2xl shadow-md bg-white flex flex-col justify-between">       
          <span className=" text-gray-700">Pending Orders</span>
          <p className="text-xl mt-7 font-medium ">32</p>    
          {/* <FontAwesomeIcon icon={faFileInvoice} size="2xl" className="text-gray-600 mt-6 relative right-3" />   */}
          <DescriptionOutlinedIcon className="mt-6 text-8xl text-amber-400" />
      </div>

      {/* Card 3 - Total Products */}
      <div className="p-5  rounded-2xl shadow-md bg-white flex flex-col justify-between">     
          <span className=" text-gray-500">Total Products</span>
          <p className="text-2xl font-medium mt-7">5</p>
          {/* <FontAwesomeIcon icon={faExclamationTriangle} size="2xl" className="text-gray-600 mt-6 relative right-3" /> */}
          <WarningAmberIcon  className="mt-6"/>
      </div>

      {/* Card 4 - Active TikTok Sales */}
      <div className="p-5 rounded-2xl  shadow-md bg-white flex flex-col justify-between">      
          <span className=" text-gray-500">Active TikTok Live Sales</span>
          <p className="text-2xl font-medium mt-7">2</p>
         {/* <FontAwesomeIcon icon={faCirclePlay} size="2xl" className="text-gray-600 mt-6 relative right-3" /> */}
         <DiscountOutlinedIcon className=" mt-6" />
      </div>

    </div>

    
    {/* this is selling chart */}
    <SellingChart />

    {/* live order records */}
       <LiveOrder />
        
        </div>
    )
}

export default Dashboard;