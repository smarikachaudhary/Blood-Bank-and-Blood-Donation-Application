import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";

const AdminUsers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getDonors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await API.get("/users/donors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonors(res.data);
      } catch (error) {
        console.error("Error fetching donors:", error.response || error);
        alert("Failed to fetch donors");
      }
    };
    getDonors();
  }, [navigate]);

  useEffect(() => {
    if (location.state?.newDonor) {
      setDonors((prev) => [...prev, location.state.newDonor]);
    }
  }, [location.state]);

  const handleDelete = async (_id) => {
    try {
      await API.delete(`/users/donors/${_id}`);
      setDonors(donors.filter((donor) => donor._id !== _id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]);

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "phone", headerName: "Contact", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "bloodType", headerName: "Blood Type", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <Link to={`/admin/donor/${params.row._id}`}>
          <button className="bg-gray-400 text-white cursor-pointer w-[70px]">Edit</button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <FaTrash className="text-red-500 cursor-pointer m-2" onClick={() => handleDelete(params.row._id)} />
      ),
    },
  ];

  return (
    <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"} min-w-[300px] mx-auto`}>
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Donors</h1>
        <Link to="/admin/newdonor">
          <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold">
            New Donor
          </button>
        </Link>
      </div>
      <div className="m-[30px]">
        <DataGrid rows={donors} getRowId={(row) => row._id} checkboxSelection columns={columns} />
      </div>
    </div>
  );
};

export default AdminUsers;
