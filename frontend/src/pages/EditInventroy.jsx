import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useLocation } from "react-router-dom";
import API from "../redux/API";

const EditInventory = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const inventoryId = location.pathname.split("/")[3];
  const [inventory, setInventory] = useState({});
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getInventory = async () => {
      try {
        const res = await API.get(`/inventory/record/${inventoryId}`);
        setInventory(res.data);
        setInputs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getInventory();
  }, [inventoryId]);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put(`/inventory/record/${inventoryId}`, inputs);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Edit Inventory</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        <label>Email</label>
        <input
          type="email"
          placeholder={inventory.email || "Enter email"}
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Transaction Type</label>
        <select
          name="inventoryType"
          value={inputs.inventoryType || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[10px] w-[300px]"
        >
          <option value="">Select Transaction Type</option>
          <option value="in">In</option>
          <option value="out">Out</option>
        </select>

        <label>Blood Type</label>
        <select
          name="bloodType"
          value={inputs.bloodType || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[10px] w-[300px]"
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label>Quantity (in mL)</label>
        <input
          type="number"
          placeholder={inventory.quantity || "Enter quantity"}
          name="quantity"
          value={inputs.quantity || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]" onClick={handleUpdate}>
          Update Inventory
        </button>
      </div>
    </div>
  );
};

export default EditInventory;
