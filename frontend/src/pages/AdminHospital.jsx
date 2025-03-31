import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";

const AdminHospital = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hospitals, setHospitals] = useState([]);

  const columns = [
    { field: "hospitalName", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "phone", headerName: "Contact", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <Link to={`/admin/hospital/${params.row._id}`}>
          <button className="bg-gray-400 text-white cursor-pointer w-[70px]">
            Edit
          </button>
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <FaTrash
          className="text-red-500 cursor-pointer m-2"
          onClick={() => handleDelete(params.row._id)}
        />
      ),
    },
  ];

  useEffect(() => {
    const getHospitals = async () => {
      try {
        const res = await API.get("/users/hospitals");
        setHospitals(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHospitals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/hospitals/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);

  return (
    <div
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"
      } min-w-[300px] mx-auto`}
    >
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Hospitals</h1>
        <Link to="/admin/newhospital">
          <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold">
            New Hospital
          </button>
        </Link>
      </div>
      <div className="m-[30px]">
        <DataGrid
          rows={hospitals}
          getRowId={(row) => row._id}
          checkboxSelection
          columns={columns}
        />
      </div>
    </div>
  );
};

export default AdminHospital;
