import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { getTokenAndEmail } from "../redux/getTokenAndEmail";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editInventory, setEditInventory] = useState(null);
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

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Deleted successfully:", response.data);
      setInventory(inventory.filter((item) => item._id !== id));
      toast.success("Inventory item deleted successfully");
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Failed to delete inventory item");
    }
  };

  const handleBulkDelete = async () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let successCount = 0;
      let failCount = 0;

      // Delete all selected inventory items one by one
      for (const id of selectedRows) {
        try {
          await API.delete(`/inventory/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to delete inventory item ${id}:`, error);
          failCount++;
        }
      }

      // Update the inventory list
      const updatedInventory = inventory.filter(
        (item) => !selectedRows.includes(item._id)
      );
      setInventory(updatedInventory);
      setSelectedRows([]); // Clear selection

      // Show appropriate message
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} inventory items`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} inventory items`);
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Failed to delete inventory items");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (item) => {
    // Get the appropriate email based on inventory type
    const email =
      item.inventoryType === "in"
        ? item.donatedBy?.email
        : item.donatedTo?.email;

    setEditInventory({
      _id: item._id,
      email: email || "", // Use empty string if no email found
      bloodType: item.bloodType,
      quantity: item.quantity,
      inventoryType: item.inventoryType,
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditInventory(null);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
        },
      });

      console.log("Deleted successfully:", response.data);
      setInventory(inventory.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };


      // Validate quantity
      if (editInventory?.quantity < 0) {
        toast.error("Quantity cannot be negative");
        return;
      }

      await API.put(`/inventory/${editInventory._id}`, editInventory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the inventory list with edited data
      setInventory(
        inventory.map((item) =>
          item._id === editInventory._id ? { ...item, ...editInventory } : item
        )
      );

      toast.success("Inventory item updated successfully");
      handleEditClose();
    } catch (error) {
      console.error("Error updating inventory item:", error);
      toast.error("Failed to update inventory item");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Columns for DataGrid
  const columns = [
    {
      field: "bloodType",
      headerName: "Blood Type",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            params.value.includes("+")
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-[#800000]"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity (ML)",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value} ml</span>
      ),
    },
    {
      field: "inventoryType",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value}</span>
      ),
    },
    {
      field: "donatedBy",
      headerName: "Donor",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-blue-600 hover:underline">
          {params.row.donatedBy?.email || "N/A"}
        </span>
      ),
    },
    {
      field: "donatedTo",
      headerName: "Recipient",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-blue-600 hover:underline">
          {params.row.donatedTo?.email || "N/A"}
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <FaEdit
          className="text-red-500 cursor-pointer hover:text-[#600000] transition-colors text-xl"
          onClick={() => handleEdit(params.row)}
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <FaTrash

          className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"

          className="text-red-500 cursor-pointer m-2"

          onClick={() => handleDelete(params.row._id)}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Inventory</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleBulkDelete}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedRows.length > 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={selectedRows.length === 0}
            >
              Delete Selected ({selectedRows.length})
            </button>
            <Link to="/admin/addblood" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition-colors">
                Update Inventory
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <DataGrid
              rows={inventory}
              getRowId={(row) => row._id}
              checkboxSelection
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              autoHeight
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
              disableColumnMenu
              disableSelectionOnClick
              onCellClick={(params, event) => {
                // Prevent row selection when clicking on cells
                event.stopPropagation();
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e5e7eb",
                  padding: "8px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f3f4f6",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeader:focus": {
                  outline: "none",
                },
                "@media (max-width: 640px)": {
                  "& .MuiDataGrid-cell": {
                    padding: "4px",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "white",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] font-semibold">Edit Inventory Item</h1>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-2">
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={editInventory?.email || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            />

            <label className="text-sm">Transaction Type</label>
            <select
              name="inventoryType"
              value={editInventory?.inventoryType || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            >
              <option value="">Select Transaction Type</option>
              <option value="in">In</option>
              <option value="out">Out</option>
            </select>

            <label className="text-sm">Blood Type</label>
            <select
              name="bloodType"
              value={editInventory?.bloodType || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            >
              <option value="">Select Blood Type</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label className="text-sm">Quantity (in mL)</label>
            <input
              type="number"
              placeholder="Enter quantity"
              name="quantity"
              value={editInventory?.quantity || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
              min="0"
              step="1"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <button
            onClick={handleEditClose}
            className="px-3 py-1.5 text-sm text-gray-600 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSave}
            className="bg-[#800000] text-white px-3 py-1.5 rounded cursor-pointer text-sm font-medium hover:bg-[#600000]"
          >
            Update Inventory
          </button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {selectedRows.length} selected
            inventory items? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "gray" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
