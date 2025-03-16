import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaHome,
  FaCog,
  FaHistory,
  FaBars,
} from "react-icons/fa";

const HospitalMenu = () => {
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
      className={`h-[110vh] bg-gray-100 shadow-lg transition-width duration-300 pt-20 ${
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
        <Link to="/hospital" onClick={() => handleLinkActive("/hospital")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[10px] transition-colors duration-100 ${
              activeLink === "/hospital"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHome
              className={`mr-[15px] ${
                activeLink === "/hospital" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Home"}
          </li>
        </Link> 
        <hr className="w-full my-[20px] border-gray-300" />
         <Link to="/hospital/bloodstock" onClick={() => handleLinkActive("/hospital/bloodstock")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/hospital/bloodstock"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaChartBar
              className={`mr-[15px] ${
                activeLink === "/hospital/bloodstock" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Bloodstock Levels"}
          </li>
        </Link>

          <Link to="/hospital/requesthistory" onClick={() => handleLinkActive("/hospital/requesthistory")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/hospital/requesthistory"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHistory
              className={`mr-[15px] ${
                activeLink === "/hospital/requesthistory" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Request History"}
          </li>
        </Link>
         <hr className="w-full my-[20px] border-gray-300" />
        <Link to="/hospital/settings" onClick={() => handleLinkActive("/hospital/settings")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/hospital/settings"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCog
              className={`mr-[15px] ${
                activeLink === "/hospital/settings" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Settings"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default HospitalMenu;
