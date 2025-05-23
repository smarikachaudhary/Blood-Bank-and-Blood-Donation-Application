import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import RecipientNavbar from "../components/RecipientNavbar";
import { useLocation } from "react-router-dom";
import API from "../redux/API";
import { toast } from "react-toastify"; // For error handling
import { MenuItem, Select } from "@mui/material"; // Import MUI dropdown

const RecipientTrackBloodRequest = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Fetch donations
        const response = await API.get("/donation/donations");
        const donationRequestsWithQuantity = await Promise.all(
          response.data.map(async (donation) => {
            // For each donation, fetch the related blood request quantity
            const bloodRequestResponse = await API.get(
              //`/request/getrequest/${donation._id}`
              `/request/getrequest`
            );
            return {
              ...donation,
              requestedQuantity: bloodRequestResponse.data
                ? bloodRequestResponse.data.requestedQuantity
                : 0,
            };
          })
        );
        setDonationRequests(donationRequestsWithQuantity);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch donations.");
        setDonationRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Function to update approval status
  const updateApprovalStatus = async (id, newStatus) => {
    try {
      await API.patch(`/donation/donations/${id}`, {
        requestApproval: newStatus,
      });
      setDonationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? { ...request, requestApproval: newStatus }
            : request
        )
      );
      toast.success(`Request updated to ${newStatus}`);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: "donatedBy", headerName: "Donor", width: 150 },
    { field: "bloodType", headerName: "Blood Type", width: 120 },
    {
      field: "donatedQuantity",
      headerName: "Donated Quantity (ml)",
      width: 150,
    },
    {
      field: "requestedQuantity",
      headerName: "Requested Quantity (ml)",
      width: 180,
      renderCell: (params) => (
        <span>{params.row.requestedQuantity || "N/A"}</span>
      ),
    },
    {
      field: "donationDate",
      headerName: "Date",
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
    {
      field: "donationRequest",
      headerName: "Donation Request",
      width: 200,
      renderCell: (params) => (
        <Select
          value={params.row.requestApproval}
          onChange={(e) => updateApprovalStatus(params.row._id, e.target.value)}
          sx={{ width: "100%", backgroundColor: "#fff" }} // Styling for better visibility
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <div
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? "w-[95vw]" : "w-[75vw]"
      } min-w-[300px] mx-auto`}
    >
      <RecipientNavbar />
      <div className="m-[30px] pt-20">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataGrid
            getRowId={(row) => row._id}
            checkboxSelection
            rows={donationRequests}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
};

export default RecipientTrackBloodRequest;
