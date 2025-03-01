import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar"; 

const EditHospital = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
        useEffect(() => {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) {
              setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
            }
          }, []);
  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
          <AdminNavbar />
          </div>
  )
}

export default EditHospital