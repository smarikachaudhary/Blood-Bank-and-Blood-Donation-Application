import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewDonor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const addDonorToList = location.state?.addDonorToList || (() => {});

  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    bloodType: "",
    status: "approved",
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDonors = async () => {
    try {
      if (inputs.name && inputs.address && inputs.phone && inputs.email && inputs.bloodType) {
        const res = await API.post("/users/donors", inputs);
        toast.success("Donor has been successfully added to the database");

        // Update AdminUsers.jsx state
        addDonorToList(res.data);

        // Reset the form
        setInputs({
          name: "",
          address: "",
          phone: "",
          email: "",
          bloodType: "",
          status: "approved",
        });

        navigate("/admin/donors"); // Navigate back to the donors list after adding
      } else {
        toast.warning("Please fill in all fields.");
      }
    } catch (error) {
      toast.warning(error.response?.data?.message || error.message || "An error occurred while adding the donor");
    }
  };

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [location]);

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">New Donor</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        {["name", "address", "phone", "email"].map((field) => (
          <div className="flex flex-col space-y-1" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "phone" ? "number" : "text"}
              name={field}
              value={inputs[field] || ""}
              onChange={handleChange}
              className="border-[#555] border-2 border-solid p-[10px] w-[300px]"
            />
          </div>
        ))}
        <div className="flex flex-col space-y-3">
          <label className="text-[18px] mt-[10px] font-semibold">Blood Group</label>
          <select name="bloodType" value={inputs.bloodType || ""} onChange={handleChange} className="border-[#555] border-2 border-solid p-[10px] w-[300px]">
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]" onClick={handleDonors}>
          Add Donor
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewDonor;
