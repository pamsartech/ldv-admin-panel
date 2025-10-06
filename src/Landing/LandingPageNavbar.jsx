import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Home from "./Home";


export default function LandingPageNavbar() {
 
   const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-800 fixed w-full z-20 top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <div className="flex items-center">
            {/* <h1 className="text-2xl font-bold">MyLogo</h1> */}
            
            <img onClick={() => navigate("/")} className="w-20 h-15 " src="/icons/logo dv.svg" alt="logo" />
          </div>

          {/* Center - Nav Links (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {["About Us", "Purchase Page", "Live Schedule", "Reviews"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group font-medium"
              >
                <span className="transition-colors duration-300 group-hover:text-[#CC3333]">
                  {item}
                </span>
                {/* Underline effect */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#B21E1E] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right - Button */}
          <div className="hidden md:flex">
            <button onClick={() => navigate("/")}
            className="bg-[#B21E1E] hover:bg-[#CC3333] text-white px-4 py-2 rounded-full transition-colors duration-300">
              Buy Your Products Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-90" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col space-y-4 px-4 py-4">
          {["About Us", "Purchase Page", "Live Schedule", "Reviews"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="block hover:text-[#02B978] transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
          <li>
            <button className="w-full bg-[#B21E1E] hover:bg-[#CC3333] text-white px-4 py-2 rounded-full transition-colors duration-300">
              Buy Your Products Now
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
