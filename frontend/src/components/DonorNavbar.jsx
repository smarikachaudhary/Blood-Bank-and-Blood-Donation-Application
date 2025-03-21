import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import API from "../redux/API";
import getTokenAndEmail from "../redux/getTokenAndEmail";

const DonorNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const inputRef = useRef(null);

  const userData = getTokenAndEmail();
  const donorId = userData?.userId;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!donorId) return;

      try {
        const res = await API.get(`/eligibility/notifications/${donorId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [donorId]);

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some((notif) => !notif.read);

  const toggleDropdown = async (dropdown) => {
    setActiveDropdown((prevState) => (prevState === dropdown ? null : dropdown));

    if (dropdown === "notifications" && hasUnreadNotifications) {
      try {
        await API.put(`/eligibility/notifications/mark-read/${donorId}`);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        ); // Mark as read locally
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-100 h-[60px] flex items-center justify-between px-6 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center space-x-2">
        <img src="/Logo.png" alt="Logo" className="w-[100px] h-[40px]" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(`Searching for: ${query}`);
        }}
        className="flex items-center bg-white rounded-full px-4 py-2 w-[300px] shadow-sm"
      >
        <FaSearch
          className="text-gray-400 mr-2 cursor-pointer"
          onClick={() => inputRef.current.focus()}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search now"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none text-sm w-full"
        />
      </form>

      <div className="flex items-center space-x-6 text-white">
        <div className="relative">
          <FaBell
            className="text-lg cursor-pointer"
            onClick={() => toggleDropdown("notifications")}
          />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 bg-red-600 rounded-full w-2 h-2"></span>
          )}
          {activeDropdown === "notifications" && (
            <div className="absolute right-0 mt-2 w-[250px] bg-white text-black shadow-lg rounded-md">
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    {notif.message}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No notifications</div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => toggleDropdown("profile")}
          />
          {activeDropdown === "profile" && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white text-black shadow-lg rounded-md">
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Profile</div>
              <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorNavbar;
