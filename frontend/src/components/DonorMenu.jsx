import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaHandHoldingWater,
  FaHome,
  FaCog,
  FaCalendar,
  FaBars,
} from "react-icons/fa";

const DonorMenu = () => {
  const [activeLink, setActiveLink] = useState("/donors");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLinkActive = (link) => {
    setActiveLink(link);
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar state
  };

  return (
    <div
      className={`h-[100vh] bg-gray-100 shadow-lg transition-width duration-300 pt-20 ${
        isCollapsed ? "w-[80px]" : "w-[350px]"
      }`}
    >
      {/* Hamburger Menu */}
      <div
        className={`p-[10px] cursor-pointer text-[#800000] flex items-center ${
          isCollapsed ? "justify-center" : "justify-end"
        }`}
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </div>

      {/* Sidebar Content */}
      <ul
        className={`flex flex-col items-start justify-start  ${
          isCollapsed ? "pl-[10px]" : "pl-[20px]"
        }`}
      >
        <Link to="/donors" onClick={() => handleLinkActive("/donors")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[10px] transition-colors duration-100 ${
              activeLink === "/donors" ? "bg-[#800000] p-[10px] text-white" : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHome
              className={`mr-[15px] ${
                activeLink === "/donors" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Home"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/donors/eligibility"
          onClick={() => handleLinkActive("/donors/eligibility")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/donors/eligibility"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCheckCircle
              className={`mr-[15px] ${
                activeLink === "/donors/eligibility"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Check Eligibility"}
          </li>
        </Link>

        <Link
          to="/donors/schedulingdonations"
          onClick={() => handleLinkActive("/donors/schedulingdonations")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/donors/schedulingdonations"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCalendar
              className={`mr-[15px] ${
                activeLink === "/donors/schedulingdonations"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Schedule Donation"}
          </li>
        </Link>
        <Link
          to="/donors/donateblood"
          onClick={() => handleLinkActive("/donors/donateblood")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/donors/donateblood"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHandHoldingWater
              className={`mr-[15px] ${
                activeLink === "/donors/donateblood"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Store Blood"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/donors/settings"
          onClick={() => handleLinkActive("/donors/settings")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/donors/settings"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCog
              className={`mr-[15px] ${
                activeLink === "/donors/settings"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Settings"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default DonorMenu;
