import { useEffect, useState } from "react";
import DonorNavbar from "../components/DonorNavbar";
import API from "../redux/API";
import { getTokenAndEmail } from "../redux/getTokenAndEmail";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const DonorEligibility = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    donorId: "", // Will be set from token
    name: "",
    email: "",
    age: "",
    weight: "",
    document: null,
  });

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }

    const userData = getTokenAndEmail();
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        donorId: userData.userId,
        email: userData.email,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });

  try {
    const response = await API.post("/eligibility/submit", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data.message, { position: "top-right" }); // Use string for position
  } catch (error) {
    console.error("Error submitting eligibility request:", error);
    toast.error("Submission failed. Please try again.", { position: "top-right" });
  }
};
 

  return (
    <div className={`w-full px-3 sm:px-6 lg:px-8 ${isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"}`}>
      <DonorNavbar />
      <div className="flex items-center justify-center m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Check Eligibility</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold">Upload Document</label>
          <input
            type="file"
            name="document"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#800000] text-white py-2 rounded-md hover:bg-[#800000] transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DonorEligibility;
