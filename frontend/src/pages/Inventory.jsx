import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { getTokenAndEmail } from "../redux/getTokenAndEmail";

const AdminInventory = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all inventory
  useEffect(() => {
    const getInventory = async () => {
      const tokenAndEmail = getTokenAndEmail();

      // Handle null case
      if (!tokenAndEmail) {
        console.log("Missing token or email. Redirecting to login.");
        navigate("/login");
        return;
      }

      const { token, email, role, userId } = tokenAndEmail;

      try {
        const res = await API.get(`/inventory/list`, {
          headers: { Authorization: `Bearer ${token}` },
          Email: email,
          Role: role,
          UserID: userId,
        });

        // Handle response
        if (res.data?.inventory) {
          setInventory(res.data.inventory);
        } else {
          setError("No inventory data found.");
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to fetch inventory. Please try again.");
        if (error.response?.status === 401) {
          console.log("Unauthorized - Redirecting to login.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    getInventory();
  }, [navigate]);

  // Handle the addition of new inventory
  useEffect(() => {
    if (location.state?.newInventory) {
      setInventory((prev) => [...prev, location.state.newInventory]);
    }
  }, [location.state]);

  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
        },
      });

      console.log("Deleted successfully:", response.data);
      setInventory(inventory.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  // Handle sidebar collapse
  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, []);

  // Columns for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "bloodType", headerName: "Blood Type", width: 150 },
    { field: "quantity", headerName: "Quantity (ML)", width: 150 },
    { field: "inventoryType", headerName: "Type", width: 150 },
    {
      field: "donatedBy",
      headerName: "Donor",
      width: 150,
      renderCell: (params) => (
        <span>{params.row.donatedBy?.email || "N/A"}</span>
      ),
    },
    {
      field: "donatedTo",
      headerName: "Recipient",
      width: 150,
      renderCell: (params) => (
        <span>{params.row.donatedTo?.email || "N/A"}</span>
      ),
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 150,
      renderCell: (params) => (
        <span>{params.row.hospital?.email || "N/A"}</span>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      renderCell: (params) => (
        <Link to={`/admin/inventory/${params.row._id}`}>
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

  return (
    <div
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"
      } min-w-[300px] mx-auto`}
    >
      <AdminNavbar />
      <div className="flex items-center justify-between m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Inventory</h1>
        <Link to="/admin/addblood">
          <button className="bg-[#800000] text-white p-[10px] rounded-md cursor-pointer font-semibold">
            Add Blood
          </button>
        </Link>
      </div>
      <div className="m-[30px]">
        {loading ? (
          <p>Loading inventory...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataGrid
            rows={inventory}
            getRowId={(row) => row._id}
            checkboxSelection
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            autoHeight
          />
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
