import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getTokenAndEmail} from "../redux/getTokenAndEmail"; 

const AddBlood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const addBloodToList = location.state?.addBloodToList || (() => {});

  const [inputs, setInputs] = useState({
    inventoryType: "in", // Default is 'in' (donation)
    bloodType: "",
    quantity: "",
    donatedBy: "",
    donatedTo: "",
  });

  const [donorEmails, setDonorEmails] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState([]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch donor emails for 'in' transactions & recipient/hospital emails for 'out'
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        if (inputs.inventoryType === "in") {
          const donorsRes = await API.get("/users/donors");
          setDonorEmails(donorsRes.data.map((donor) => donor.email));
        } else {
          const recipientsRes = await API.get("/users/recipients");
          const hospitalsRes = await API.get("/users/hospitals");
          setRecipientEmails([
            ...recipientsRes.data.map((recipient) => recipient.email),
            ...hospitalsRes.data.map((hospital) => hospital.email),
          ]);
        }
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    };
    fetchEmails();
  }, [inputs.inventoryType]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleAddBlood = async () => {
  try {
    console.log("Submitting Data:", inputs);

    // Get email and role from the token
    const userData = getTokenAndEmail();

    if (!userData) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    const { email, role } = userData;

    // Ensure only admins can create inventory
    if (role !== "admin") {
      toast.error("Only admins can add inventory.");
      return;
    }

    if (inputs.bloodType && inputs.quantity) {
      const res = await API.post("/inventory/create", {
        ...inputs,
        role,  // Always send role as "admin"
        email, // Ensure correct admin email is sent
      });

      toast.success("Blood entry successfully added!");

      addBloodToList(res.data.inventory);
      setInputs({
        inventoryType: "in",
        bloodType: "",
        quantity: "",
        donatedBy: "",
        donatedTo: "",
      });

      navigate("/admin/inventory");
    } else {
      toast.warning("Please fill in all fields.");
    }
  } catch (error) {
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || "Error adding inventory");
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
        <h1 className="text-[20px] font-semibold">Add Blood Entry</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        {/* Inventory Type */}
        <div className="flex flex-col space-y-1">
          <label>Transaction Type</label>
          <select name="inventoryType" value={inputs.inventoryType} onChange={handleChange} className="border-[#555] border-2 p-[10px] w-[300px]">
            <option value="in">IN (Donation)</option>
            <option value="out">OUT (Request)</option>
          </select>
        </div>

        {/* Blood Type */}
        <div className="flex flex-col space-y-1">
          <label>Blood Group</label>
          <select name="bloodType" value={inputs.bloodType} onChange={handleChange} className="border-[#555] border-2 p-[10px] w-[300px]">
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="flex flex-col space-y-1">
          <label>Quantity (ML)</label>
          <input
            type="number"
            name="quantity"
            value={inputs.quantity}
            onChange={handleChange}
            className="border-[#555] border-2 p-[10px] w-[300px]"
          />
        </div>

        {/* Donor (for IN transactions) */}
        {inputs.inventoryType === "in" && (
          <div className="flex flex-col space-y-1">
            <label>Donor Email</label>
            <select name="donatedBy" value={inputs.donatedBy} onChange={handleChange} className="border-[#555] border-2 p-[10px] w-[300px]">
              <option value="">Select Donor</option>
              {donorEmails.map((email) => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
        )}

        {/* Recipient (for OUT transactions) */}
        {inputs.inventoryType === "out" && (
          <div className="flex flex-col space-y-1">
            <label>Recipient Email</label>
            <select name="donatedTo" value={inputs.donatedTo} onChange={handleChange} className="border-[#555] border-2 p-[10px] w-[300px]">
              <option value="">Select Recipient</option>
              {recipientEmails.map((email) => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]" onClick={handleAddBlood}>
          Add Entry
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBlood;
