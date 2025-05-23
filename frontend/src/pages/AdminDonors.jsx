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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getDonors = async () => {
      try {
        setLoading(true);
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
        setError("Failed to fetch donors");
        toast.error("Failed to fetch donors");
      } finally {
        setLoading(false);
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
      toast.success("Donor deleted successfully");
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast.error("Failed to delete donor");
    }
  };

  const handleBulkDelete = async () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let successCount = 0;
      let failCount = 0;

      // Delete all selected donors one by one
      for (const id of selectedRows) {
        try {
          await API.delete(`/users/donors/${id}`);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete donor ${id}:`, error);
          failCount++;
        }
      }

      // Update the donors list
      const updatedDonors = donors.filter(
        (donor) => !selectedRows.includes(donor._id)
      );
      setDonors(updatedDonors);
      setSelectedRows([]); // Clear selection

      // Show appropriate message
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} donors`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} donors`);
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Failed to delete donors");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (donor) => {
    setEditDonor({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      bloodType: donor.bloodType,
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditDonor(null);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await API.put(`/users/donors/${editDonor._id}`, editDonor, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the donors list with edited data
      setDonors(
        donors.map((donor) =>
          donor._id === editDonor._id ? { ...donor, ...editDonor } : donor
        )
      );

      toast.success("Donor updated successfully");
      handleEditClose();
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error("Failed to update donor");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDonor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-gray-900">{params.value}</span>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value}</span>
      ),
    },
    {
      field: "phone",
      headerName: "Contact",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-blue-600 hover:underline">{params.value}</span>
      ),
    },
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
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            params.value === "Validated" || params.value === "Approved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {"Validated"}
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
      <div className="w-[90vw] mx-auto relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-20">
          <h2 className="text-2xl font-semibold text-gray-800">Donors</h2>
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
            <Link to="/admin/newdonor" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition-colors">
                New Donor
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <DataGrid
              rows={donors}
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
              // isRowSelectable={(params) => true}
              disableSelectionOnClick
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
            <h1 className="text-[18px] font-semibold">Edit Donor</h1>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-2">
            <label className="text-sm">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              value={editDonor?.name || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            />

            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={editDonor?.email || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            />

            <label className="text-sm">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              name="address"
              value={editDonor?.address || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            />

            <label className="text-sm">Contact</label>
            <input
              type="number"
              placeholder="Enter phone number"
              name="phone"
              value={editDonor?.phone || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm"
            />

            <label className="text-sm">Blood Type</label>
            <select
              name="bloodType"
              value={editDonor?.bloodType || ""}
              onChange={handleInputChange}
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm bg-white"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <label className="text-sm">Status</label>
            <input
              type="text"
              value="Validated"
              readOnly
              className="border-b border-[#555] outline-none p-[3px] w-full text-sm bg-gray-50 cursor-not-allowed"
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
            Update Donor
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
            donors? This action cannot be undone.
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

export default AdminDonors;
