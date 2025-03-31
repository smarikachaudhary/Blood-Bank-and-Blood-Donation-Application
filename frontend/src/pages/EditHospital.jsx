import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useLocation } from "react-router-dom";
import API from "../redux/API";

const EditHospital = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const hospitalId = location.pathname.split("/")[3];
  const [hospital, setHospital] = useState({});
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getHospital = async () => {
      try {
        const res = await API.get(`/users/hospitals/${hospitalId}`);
        setHospital(res.data);
        setInputs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getHospital();
  }, [hospitalId]);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put(`/users/hospitals/${hospitalId}`, inputs);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"
      } min-w-[300px] mx-auto`}
    >
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Edit Hospital</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        <label>Hospital Name</label>
        <input
          type="text"
          placeholder={hospital.hospitalName}
          name="hospitalName"
          value={inputs.hospitalName || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Email</label>
        <input
          type="email"
          placeholder={hospital.email}
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Contact</label>
        <input
          type="text"
          placeholder={hospital.phone}
          name="phone"
          value={inputs.phone || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Address</label>
        <input
          type="text"
          placeholder={hospital.address}
          name="address"
          value={inputs.address || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />
        <label>Status</label>
        <input
          type="text"
          placeholder={hospital.status}
          name="status"
          value={inputs.status || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <button
          className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]"
          onClick={handleUpdate}
        >
          Update Hospital
        </button>
      </div>
    </div>
  );
};

export default EditHospital;
