import { useEffect, useState } from "react";
import DonorNavbar from "../components/DonorNavbar";
import API from "../redux/API";
import getTokenAndEmail from "../redux/getTokenAndEmail";

const Donors = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationData, setDonationData] = useState({
    donorName: "",
    donatedQuantity: "",
    donorEmail: "",
    donorId: "",
    donationDate: new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user data and sidebar state
  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }

    const userData = getTokenAndEmail();
    if (userData) {
      setDonationData((prev) => ({
        ...prev,
        donorName: userData.name || "",
        donorEmail: userData.email,
        donorId: userData.userId || "",
      }));
    }
  }, []);

  // Fetch blood requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await API.get("/request/getrequest");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching blood requests:", error);
        setError("Failed to load requests. Please refresh the page.");
      }
    };
    fetchRequests();
  }, []);

  const handleDonateClick = (request) => {
    setSelectedRequest(request);
    setDonationData((prev) => ({
      ...prev,
      donatedQuantity: "",
      donationDate: new Date().toISOString().slice(0, 16),
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!donationData.donorName.trim()) {
      setError("Please enter your name");
      return;
    }

    const donatedQuantity = Number(donationData.donatedQuantity);
    if (isNaN(donatedQuantity)) {
      setError("Please enter a valid quantity");
      return;
    }

    if (donatedQuantity <= 0) {
      setError("Donation quantity must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestBody = {
        donorId: donationData.donorId,
        donatedBy: donationData.donorName.trim(),
        donorEmail: donationData.donorEmail,
        donationDate: donationData.donationDate,
        bloodType: selectedRequest.requestedBloodGroup,
        donatedQuantity: donatedQuantity,
        requestedQuantity: selectedRequest.requestedQuantity,
      };

      const response = await API.post("/donation/submit", requestBody);

      if (response.data.success) {
        // Refresh requests after successful submission
        const updatedRequests = await API.get("/request/getrequest");
        setRequests(updatedRequests.data);
        setSelectedRequest(null);
      } else {
        setError(response.data.message || "Donation submission failed");
      }
    } catch (error) {
      console.error("Donation submission error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to submit donation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full px-3 sm:px-6 lg:px-8 ${
        isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"
      }`}
    >
      <DonorNavbar />
      <header className="flex justify-between items-center mb-6 gap-10 px-10 pt-20">
        <h1 className="text-2xl font-semibold text-black">Hi Donor!</h1>
      </header>

      {error && (
        <div className="px-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-10">
        {requests
          .filter((request) => request.status !== "Fulfilled")
          .map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105"
            >
              <div className="flex justify-between">
                <span className="text-sm font-bold text-red-600">
                  {request.requestedBloodGroup}
                </span>
                {request.requestType && (
                  <span className="text-red-600 font-semibold text-sm">
                    Urgent
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {request.requestedBy}
              </h2>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Requested for: {request.requestedFor}
                </p>
                <p className="text-sm text-gray-600">
                  Needed by: {new Date(request.neededTime).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">
                    Requested: {request.requestedQuantity} unit(s)
                  </p>
                  <p className="text-sm text-gray-600">
                    Donated: {request.donatedQuantity || 0} unit(s)
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((request.donatedQuantity || 0) /
                          request.requestedQuantity) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                onClick={() => handleDonateClick(request)}
              >
                Request Donation
              </button>
            </div>
          ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedRequest(null)}
              disabled={isSubmitting}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Donation Form
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={donationData.donorName}
                  onChange={(e) =>
                    setDonationData({
                      ...donationData,
                      donorName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  value={donationData.donorEmail}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={donationData.donationDate}
                  onChange={(e) =>
                    setDonationData({
                      ...donationData,
                      donationDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  value={selectedRequest.requestedBloodGroup}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requested Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    value={selectedRequest.requestedQuantity}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Donate
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={donationData.donatedQuantity}
                    onChange={(e) =>
                      setDonationData({
                        ...donationData,
                        donatedQuantity: Math.max(0, e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Donation"
                )}
              </button>
            </div>
            <button
              className="mt-4 bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={handleSubmit}
            >
              Submit Donation Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donors;
