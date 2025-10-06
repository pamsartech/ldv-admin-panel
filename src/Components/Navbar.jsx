// src/components/Navbar.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function Navbar(props) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>

        <nav className="w-full bg-white border-b border-gray-400 px-6 py-3 flex items-center justify-between">

      {/* Left Section */}
      <div>
        <h1 className="text-lg font-medium"> {props.heading} </h1>
      </div>

      {/* Search Bar */}
      {/* <div className="relative w-1/3">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-gray-800">
          <FontAwesomeIcon icon={faBell} size="lg" />
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369991.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-sm">Louis G</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-100 border border-gray-400 rounded-lg shadow-lg py-2">

              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> Profile </a>

              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> Settings</a>

              <a href="#logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"> Logout </a>

            </div>
          )}
        </div>
      </div>
    </nav>

    </div>
    
  );
}

export default Navbar;