import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChevronDown,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ heading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔔 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://dev-api.payonlive.com/api/notifications");
      if (response.data) {
        // Some APIs may return array or single object — handle both
        const notifArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setNotifications(notifArray);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto-fetch when navbar mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-400 px-6 py-3 flex items-center justify-between relative">
      {/* Left Section */}
      <h1 className="text-lg font-semibold text-gray-900">{heading}</h1>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (!notifOpen) fetchNotifications(); // Refresh when opening
            }}
            className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="text-gray-500 text-sm"
                  />
                )}
              </div>

              {error && (
                <div className="text-red-500 text-center text-sm p-3">
                  {error}
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="text-gray-500 text-center text-sm p-3">
                  No new notifications
                </div>
              )}

              {!loading && notifications.length > 0 && (
                <ul>
                  {notifications.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {item.eventDetails?.eventName || "Untitled Event"}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {item.eventDetails?.eventDescription || "No description"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Host: {item.hostInformation?.hostName || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

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

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-100 border border-gray-400 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
