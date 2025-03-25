import { FaSearch, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import { useState, useRef } from "react";

const AdminNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log(`Searching for: ${query}`);
    } else {
      console.log("Please enter a search query");
    }
  };

  const handleSearchIconClick = () => {
    inputRef.current.focus();
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prevState) =>
      prevState === dropdown ? null : dropdown
    );
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="bg-gray-100 h-[60px] flex items-center justify-between px-6 shadow-md fixed top-0 left-0 right-0 z-10">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-2">
        <img src="/Logo.png" alt="Logo" className="w-[100px] h-[40px]" />
      </div>

      {/* Center Section: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-full px-4 py-2 w-[300px] shadow-sm"
      >
        <FaSearch
          className="text-gray-400 mr-2 cursor-pointer"
          onClick={handleSearchIconClick}
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

      {/* Right Section: Icons and Profile */}
      <div className="flex items-center space-x-6 text-white">
        {/* Messages Icon with Dropdown */}
        <div className="relative">
          <FaEnvelope
            className="text-lg cursor-pointer"
            onClick={() => toggleDropdown("messages")}
          />
          {activeDropdown === "messages" && (
            <div className="absolute right-0 mt-2 w-[200px] bg-white text-black shadow-lg rounded-md">
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Message 1
              </div>
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Message 2
              </div>
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                View All Messages
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <FaBell
            className="text-lg cursor-pointer"
            onClick={() => toggleDropdown("notifications")} // Toggle notifications dropdown
          />
          <span className="absolute top-0 right-0 bg-red-600 rounded-full w-2 h-2"></span>{" "}
          {/* Notification indicator */}
          {activeDropdown === "notifications" && (
            <div className="absolute right-0 mt-2 w-[200px] bg-white text-black shadow-lg rounded-md">
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Notification 1
              </div>
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Notification 2
              </div>
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                View All Notifications
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => toggleDropdown("profile")} // Toggle profile dropdown
          />
          {activeDropdown === "profile" && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white text-black shadow-lg rounded-md">
              <div
                onClick={() => console.log("Navigating to Profile...")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Profile
              </div>
              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
