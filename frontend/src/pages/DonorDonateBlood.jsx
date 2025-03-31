import { useEffect, useState } from "react";
import DonorNavbar from "../components/DonorNavbar";
import { useLocation } from "react-router-dom"; 

const DonorDonateBlood = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains('w-[80px]')); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]); 
  
  return (
    <div className={`w-full px-3 sm:px-6 lg:px-8 ${isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"}`}>
      <DonorNavbar />
    </div>
  );
};

export default DonorDonateBlood;
