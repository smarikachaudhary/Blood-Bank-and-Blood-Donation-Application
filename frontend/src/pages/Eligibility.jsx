import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API"; // Import your API file if needed for requests

const Eligibility = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [eligibilityRequests, setEligibilityRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]);

  useEffect(() => {
    // Fetch eligibility requests when the component mounts
    const fetchEligibilityRequests = async () => {
      try {
        const response = await API.get("/eligibility/requests"); // Adjust the API endpoint accordingly
        setEligibilityRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching eligibility requests:", error);
        setLoading(false);
      }
    };

    fetchEligibilityRequests();
  }, []);

  const columns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "age", headerName: "Age", width: 150 },
  { field: "weight", headerName: "Weight", width: 150 },
  {
    field: "document",
    headerName: "Document",
    width: 200,
    renderCell: (params) => {
      if (!params.value) return "No File";

      const documentUrl = `http://localhost:8000/uploads/${params.value.split("\\").pop()}`;

      return (
        <button onClick={() => setSelectedImage(documentUrl)} className="text-blue-500">
          View Document
        </button>
      );
    },
  },
  {
    field: "status",
    headerName: "Eligibility",
    width: 150,
    renderCell: (params) => {
      return (
        <select
          value={eligibilityRequests.find((req) => req._id === params.row._id)?.status || "Pending"}
          onChange={(e) => handleStatusChange(e, params.row._id)}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      );
    },
  },
];



  const handleStatusChange = async (e, id) => {
    const updatedStatus = e.target.value;

    // Optimistically update the state to reflect UI changes
    setEligibilityRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === id ? { ...request, status: updatedStatus } : request
      )
    );

    try {
      const response = await API.put(`/eligibility/review/${id}`, {
        status: updatedStatus,
      });

      if (response.status !== 200) {
        console.error("Failed to update status in the database");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="m-[30px] pt-20">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataGrid
            getRowId={(row) => row._id}
            checkboxSelection
            rows={eligibilityRequests}
            columns={columns}
          />
        )}
      </div>
      {/* Popup for image preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-red-500">X</button>
            <img src={selectedImage} alt="Document" className="max-w-full max-h-[80vh] rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Eligibility;