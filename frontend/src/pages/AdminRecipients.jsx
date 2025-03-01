import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // To detect route changes
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";

const AdminRecipients = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [recipients, setRecipients] = useState([]);

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "recipientName", headerName: "Name", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "phone", headerName: "Contact", width: 150 },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/recipient/${params.row._id}`}>
              <button className="bg-gray-400 text-white cursor-pointer w-[70px]">
                Edit
              </button>
            </Link>
          </>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <FaTrash
              className="text-red-500 cursor-pointer m-2"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const getRecipients = async () => {
      try {
        const res = await API.get("/users/recipients");
        setRecipients(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRecipients();
  }, []);

  const handleDelete = async (_id) => {
    try {
      await API.delete(`/users/recipients/${_id}`);
      setRecipients(recipients.filter(recipient => recipient._id !== _id));
    } catch (error) {
      console.log(error);
    }
  };

  // Detect sidebar state dynamically
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
        <h1 className="text-[20px] font-semibold">Recipients</h1>
        <Link to="/admin/newrecipient">
          <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold">
            New Donor
          </button>
        </Link>
      </div>
      <div className="m-[30px]">
        <DataGrid rows={recipients} getRowId={(row) => row._id} checkboxSelection columns={columns} />
      </div>
    </div>
  );
};

export default AdminRecipients;
