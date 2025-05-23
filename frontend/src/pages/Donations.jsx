
import AdminNavbar from "../components/AdminNavbar";

const Donations = () => {
  return (
    <div className="w-[70vw]">
      <AdminNavbar />

import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Api from "../redux/API";
import { toast } from "react-toastify";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    id: null,
    reason: "",
  });

  useEffect(() => {
    Api.get("/storage/donations")
      .then((res) => setDonations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "rejected") {
      setRejectionModal({ open: true, id, reason: "" });
    } else {
      updateDonationStatus(id, newStatus);
    }
  };

  const updateDonationStatus = async (id, status, reason = "") => {
    try {
      const updateData = { status };
      if (status === "rejected") updateData.rejectionReason = reason;

      await Api.put(`/storage/donations/${id}`, updateData);
      setDonations((prev) =>
        prev.map((donation) =>
          donation._id === id ? { ...donation, ...updateData } : donation
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleRejectionSubmit = () => {
    if (!rejectionModal.reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    updateDonationStatus(rejectionModal.id, "rejected", rejectionModal.reason);
    setRejectionModal({ open: false, id: null, reason: "" });
  };

  return (
    <div className="w-[90vw] mx-auto relative">
      <AdminNavbar />
      <h2 className="text-2xl font-semibold mt-20 my-6">Blood Donations</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity (ml)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Donor Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Donation Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      donation.bloodType.includes("+")
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {donation.bloodType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {donation.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                  <a
                    href={`mailto:${donation.donorEmail}`}
                    className="hover:underline"
                  >
                    {donation.donorEmail}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(donation.lastDonationDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {donation.expirationDate
                    ? new Date(donation.expirationDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <select
                      value={donation.status}
                      onChange={(e) =>
                        handleStatusChange(donation._id, e.target.value)
                      }
                      className={`block w-full px-2 py-1 text-sm rounded-md border shadow-sm focus:outline-none
                        ${
                          donation.status === "accepted"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : donation.status === "rejected"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        }
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {donation.status === "rejected" &&
                      donation.rejectionReason && (
                        <div className="text-xs text-red-500">
                          Reason: {donation.rejectionReason}
                        </div>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {rejectionModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() =>
                setRejectionModal({ open: false, id: null, reason: "" })
              }
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-3">Rejection Reason</h3>
            <textarea
              rows="4"
              className="w-full border rounded p-2 focus:outline-red-400"
              placeholder="Enter reason..."
              value={rejectionModal.reason}
              onChange={(e) =>
                setRejectionModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />
            <button
              onClick={handleRejectionSubmit}
              className="mt-4 bg-[#800000] text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Donations;
