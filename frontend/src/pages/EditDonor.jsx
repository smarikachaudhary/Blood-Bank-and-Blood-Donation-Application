import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar"; 
import { useLocation } from "react-router-dom";
import API from "../redux/API";

const EditDonor = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const donorId = location.pathname.split("/")[3];
  const [donor, setDonor] = useState({});
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getDonor = async () => {
      try {
        const res = await API.get(`/users/donors/${donorId}`);
        setDonor(res.data);
        setInputs(res.data); 
      } catch (error) {
        console.log(error);
      }
    };

    getDonor();
  }, [donorId]); 

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put(`/users/donors/${donorId}`, inputs);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Edit Donor</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">    
        <label>Name</label>
        <input
          type="text"
          placeholder={donor.name}        
          name="name"
          
          value={inputs.name || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Email</label>
        <input
          type="email"
          placeholder={donor.email} 
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        /> 

        <label>Address</label>
        <input
          type="text"
          placeholder={donor.address} 
          name="address"
          value={inputs.address || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        /> 

        <label>Contact</label>
        <input
          type="number"
          placeholder={donor.phone} 
          name="contact"
          value={inputs.phone || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        /> 

        <label>Blood Type</label>
        <select
          name="bloodType"
          placeholder={donor.bloodType} 
          value={inputs.bloodType || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[10px] w-[300px]"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label>Status</label>
        <input
          type="text"
          placeholder={donor.status} 
          name="status" 
          value={inputs.status || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />     

        <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]" onClick={handleUpdate}>
          Update Donor
        </button>
      </div>
    </div>
  );
};

export default EditDonor;
