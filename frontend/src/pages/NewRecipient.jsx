import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewRecipient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const addRecipientToList = location.state?.addRecipientToList || (() => {});

  const [inputs, setInputs] = useState({
    recipientName: "", // changed name to recipientName
    address: "",
    phone: "",
    email: "",
    status: "approved",
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRecipients = async () => {
    try {
      if (inputs.recipientName && inputs.address && inputs.phone && inputs.email) { // changed name to recipientName
        const res = await API.post("/users/recipients", inputs);
        toast.success("Recipient has been successfully added to the database");

        // Update AdminRecipients.jsx state
        addRecipientToList(res.data);

        // Reset the form
        setInputs({
          recipientName: "", // changed name to recipientName
          address: "",
          phone: "",
          email: "",
          status: "approved",
        });

        navigate("/admin/recipients"); // Navigate back to the recipients list after adding
      } else {
        toast.warning("Please fill in all fields.");
      }
    } catch (error) {
      toast.warning(error.response?.data?.message || error.message || "An error occurred while adding the recipient");
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
        <h1 className="text-[20px] font-semibold">New Recipient</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        {["recipientName", "address", "phone", "email"].map((field) => ( // changed name to recipientName
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
        <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]" onClick={handleRecipients}>
          Add Recipient
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewRecipient;
