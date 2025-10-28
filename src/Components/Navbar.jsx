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
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://dev-api.payonlive.com/api/notifications"
      );

      if (response.data && response.data.success) {
        const { data, pagination } = response.data;
        setNotifications(data || []);
        setUnreadCount(pagination?.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between relative">
      {/* Left Section */}
      <h1 className="text-lg font-semibold text-gray-900">{heading}</h1>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (!notifOpen) fetchNotifications(); // refresh when opened
            }}
            className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-300 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
              {/* Header */}
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Notifications
                </h3>
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="text-gray-500 text-sm"
                  />
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-500 text-center text-sm p-3">
                  {error}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && notifications.length === 0 && (
                <div className="text-gray-500 text-center text-sm p-4">
                  No new notifications
                </div>
              )}

              {/* Notification List */}
              {!loading && notifications.length > 0 && (
                <ul>
                  {notifications.map((item) => (
                    <li
                      key={item._id}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        {item.message}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          item.isRead ? "text-gray-400" : "text-blue-600"
                        }`}
                      >
                        {item.isRead ? "Read" : "Unread"}
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

