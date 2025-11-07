import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars,  faBoxOpen,} from "@fortawesome/free-solid-svg-icons";
import DashboardOutlinedIcon   from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

function Sidebar() {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${ isOpen ? "w-64" : "w-20"} min-h-screen bg-white text-black border border-gray-400 flex flex-col transition-all duration-300`}>

      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 flex justify-start">

        <div className="flex items-center  space-x-10">
          <FontAwesomeIcon icon={isOpen ? faBars : faBars} size="lg" />
           {isOpen && <img className=" mx-auto w-18 h-12" src="/icons/logo dv.svg" alt="logo" /> }  
        </div>

      </button>

      {/* Links */}
      <nav className="flex flex-col space-y-2 mt-4">

        <NavLink to="/user/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${ isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white" }`}>
          {/* <FontAwesomeIcon icon={faHome} size="lg" /> */}
            <DashboardOutlinedIcon />
          {isOpen && <span>Tableau de bord </span>}
        </NavLink>

        <NavLink to="/user/products" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${ isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}`}>
          <FontAwesomeIcon icon={faBoxOpen}  size="lg" />
          {/* <ProductionQuantityLimitsIcon  /> */}
          {isOpen && <span>	Tableau de bord </span>}
        </NavLink>

        <NavLink to="/user/orders" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}` }>
          {/* <FontAwesomeIcon icon={faFileCircleCheck} size="lg" /> */}
          <DescriptionOutlinedIcon />
          {isOpen && <span>Commandes</span>}
        </NavLink>

        <NavLink to="/user/customers"  className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}`}>
          <PeopleOutlineOutlinedIcon />
          {isOpen && <span>Clients</span>}
        </NavLink>

        <NavLink to="/user/payments" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}`}>
          {/* <FontAwesomeIcon icon={faMoneyCheckDollar} size="lg" /> */}
          <PaymentsOutlinedIcon />
          {isOpen && <span>Paiements</span>}
        </NavLink>

        <NavLink to="/user/tiktok" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 rounded-md border-[#C8C8C8] transition-colors ${isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}`}>
          
          <SignalCellularAltOutlinedIcon />
          {isOpen && <span>Session TikTok Live</span>}
        </NavLink>

        <NavLink to="/user/setting" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-1.5 border-1 border-[#C8C8C8] rounded-md transition-colors ${isActive ? "bg-[#02B978] text-white" : "hover:bg-[#04D18C] hover:text-white"}`}>
          {/* <FontAwesomeIcon icon={faGear} size="lg" /> */}
          <SettingsOutlinedIcon />
          {isOpen && <span>Paramètres</span>}
        </NavLink>
        
      </nav>
    </div>
  );
}

export default Sidebar;