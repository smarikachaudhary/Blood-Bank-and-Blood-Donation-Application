import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInbox,
  FaHome,
  FaCog,
  FaClipboardList,
  FaBars,

} from "react-icons/fa";

const RecipientMenu = () => {
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
        <Link to="/recipients" onClick={() => handleLinkActive("/recipients")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[10px] transition-colors duration-100 ${
              activeLink === "/recipients"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaHome
              className={`mr-[15px] ${
                activeLink === "/recipients" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Home"}
          </li>
        </Link> 
        <hr className="w-full my-[20px] border-gray-300" />
         <Link to="/recipients/makerequest" onClick={() => handleLinkActive("/recipients/makerequest")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/recipients/makerequest"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaInbox 
              className={`mr-[15px] ${
                activeLink === "/recipients/makerequest" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Make Blood request"}
          </li>
        </Link>

          <Link to="/recipients/trackbloodrequest" onClick={() => handleLinkActive("/recipients/trackbloodrequest")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/recipients/trackbloodrequest"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaClipboardList
              className={`mr-[15px] ${
                activeLink === "/recipients/trackbloodrequest" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Track Blood Request"}
          </li>
        </Link>
         
         <hr className="w-full my-[20px] border-gray-300" />
        <Link to="/recipients/settings" onClick={() => handleLinkActive("/recipients/settings")}>
          <li
            className={`flex items-center text-[20px] font-semibold cursor-pointer mt-[20px] transition-colors duration-100 ${
              activeLink === "/recipients/settings"
                ? "bg-[#800000] p-[10px] text-white"
                : ""
            } ${isCollapsed ? "w-[50px] justify-center" : "w-[300px]"}`}
          >
            <FaCog
              className={`mr-[15px] ${
                activeLink === "/recipients/settings" ? "text-white" : "text-[#800000]"
              } ${isCollapsed ? "mr-0" : ""}`}
            />
            {!isCollapsed && "Settings"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default RecipientMenu;
