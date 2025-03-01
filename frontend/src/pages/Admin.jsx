import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useLocation } from "react-router-dom"; 

const Home = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Detect if the sidebar is collapsed or not
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains('w-[80px]'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]); // Detect when location changes
  
  return (
    <div className={`w-full px-3 sm:px-6 lg:px-8 ${isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"}`}>
      <AdminNavbar />
      {/* Header */}
      <header className="flex justify-between items-center mb-6 gap-10 px-10 pt-20">
        <h1 className="text-2xl font-semibold text-black">Hi Admin!</h1>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8 w-full">
        {[
          { label: "Total Users", value: "----", change: "+3.5%" },
          { label: "Donors", value: "---", change: "+11%" },    
          { label: "Recipients", value: "---", change: "-2.4%" },
          { label: "Hospitals", value: "---", change: "+3.5%" },
        ].map((item, index) => (
          <div
            key={index}
            className="p-2 bg-[#c5a37d] rounded-md shadow-md flex justify-between items-center min-h-[100px] w-[270px]"
          >
            <div>
              <p className="text-sm text-black">{item.label}</p>
              <h2 className="text-lg font-bold text-white">{item.value}</h2>
            </div>
            <p
              className={`text-sm ${
                item.change.startsWith("+") ? "text-green-900" : "text-red-900"
              }`}
            >
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
