import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useLocation } from "react-router-dom";
import API from "../redux/API";

const EditRecipient = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const recipientId = location.pathname.split("/")[3];
  const [recipient, setRecipient] = useState({});
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getRecipient = async () => {
      try {
        const res = await API.get(`/users/recipients/${recipientId}`);
        setRecipient(res.data);
        setInputs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getRecipient();
  }, [recipientId]);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put(`/users/recipients/${recipientId}`, inputs);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Edit Recipient</h1>
      </div>
      <div className="flex flex-col my-[12px] pl-[35px] space-y-3">
        <label>Recipient Name</label>
        <input
          type="text"
          placeholder={recipient.recipientName}
          name="recipientName"
          value={inputs.recipientName || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Email</label>
        <input
          type="email"
          placeholder={recipient.email}
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Contact</label>
        <input
          type="text"
          placeholder={recipient.phone}
          name="phone"
          value={inputs.phone || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <label>Address</label>
        <input
          type="text"
          placeholder={recipient.address}
          name="address"
          value={inputs.address || ""}
          onChange={handleChange}
          className="border-b-2 border-[#555] outline-none p-[5px] w-[300px]"
        />

        <button
          className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold w-[300px]"
          onClick={handleUpdate}
        >
          Update Recipient
        </button>
      </div>
    </div>
  );
};

export default EditRecipient;
