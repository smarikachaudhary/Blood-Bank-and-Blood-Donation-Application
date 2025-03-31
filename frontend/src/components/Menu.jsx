import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaCheckCircle,
  // FaCalendarAlt,
  // FaChartBar,
  // FaCheckCircle,
  // FaClipboard,
  // FaCog,
  // FaElementor,
  FaHandHoldingWater,
  // FaHdd,
  FaHome,
  FaHospital,
  // FaRibbon,
  // FaSignOutAlt,
  //  FaStamp,
  FaTint,
  FaUser,
  FaUsers,
  FaBars,
  FaCog,
} from "react-icons/fa";

const Menu = () => {
  const [activeLink, setActiveLink] = useState("/admin");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLinkActive = (link) => {
    setActiveLink(link);
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar state
  };

  return (
    <div
      className={`h-[120vh] bg-gray-100 shadow-lg transition-width duration-300 pt-20 ${
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
        <Link to="/admin" onClick={() => handleLinkActive("/admin")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[10px] transition-colors duration-100 ${
              activeLink === "/admin" ? "bg-[#800000] p-[10px] text-white" : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHome
              className={`mr-[15px] ${
                activeLink === "/admin" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Home"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/admin/users"
          onClick={() => handleLinkActive("/admin/users")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/users"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaUsers
              className={`mr-[15px] ${
                activeLink === "/admin/users" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Users"}
          </li>
        </Link>

        <Link
          to="/admin/donors"
          onClick={() => handleLinkActive("/admin/donors")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/donors"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHandHoldingWater
              className={`mr-[15px] ${
                activeLink === "/admin/donors" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Donors"}
          </li>
        </Link>
        <Link
          to="/admin/recipients"
          onClick={() => handleLinkActive("/admin/recipients")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/recipients"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaUser
              className={`mr-[15px] ${
                activeLink === "/admin/recipients"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Recipients"}
          </li>
        </Link>
        <Link
          to="/admin/hospital"
          onClick={() => handleLinkActive("/admin/hospital")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/hospital"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHospital
              className={`mr-[15px] ${
                activeLink === "/admin/hospital"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Hospital"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/admin/inventory"
          onClick={() => handleLinkActive("/admin/inventory")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/inventory"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaBox
              className={`mr-[15px] ${
                activeLink === "/admin/inventory"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Inventory"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/admin/donations"
          onClick={() => handleLinkActive("/admin/donations")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/donations"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaTint
              className={`mr-[15px] ${
                activeLink === "/admin/donations"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Blood Donations"}
          </li>
        </Link>
        <Link
          to="/admin/bloodrequests"
          onClick={() => handleLinkActive("/admin/bloodrequests")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/bloodrequests"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaTint
              className={`mr-[15px] ${
                activeLink === "/admin/bloodrequests"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Blood Requests"}
          </li>
        </Link>
        <Link
          to="/admin/eligibility"
          onClick={() => handleLinkActive("/admin/eligibility")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/eligibility"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCheckCircle
              className={`mr-[15px] ${
                activeLink === "/admin/eligibility"
                  ? "text-white"
                  : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Eligibility"}
          </li>
        </Link>
        <hr className="w-full my-[20px] border-gray-300" />
        <Link
          to="/admin/logout"
          onClick={() => handleLinkActive("/admin/logout")}
        >
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/admin/logout"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCog
              className={`mr-[15px] ${
                activeLink === "/admin/logout" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Settings"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Menu;
