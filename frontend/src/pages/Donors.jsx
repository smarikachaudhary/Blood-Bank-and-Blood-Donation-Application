import { useEffect, useState } from "react";
import DonorNavbar from "../components/DonorNavbar";
import { useLocation } from "react-router-dom";
import API from "../redux/API";

const Donors = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationData, setDonationData] = useState({
    donorName: "",
    donatedQuantity: "",
    donationDate: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]);

  useEffect(() => {
    API.get("/request/getrequest")
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blood requests:", error);
      });
  }, []);

  const handleDonateClick = (request) => {
    setSelectedRequest(request);
    setDonationData({
      donorName: "",
      donatedQuantity: "",
      donationDate: new Date().toISOString().slice(0, 16),
    });
  };

  const handleSubmit = () => {
    if (!donationData.donorName) {
      alert("Please enter your name before submitting the donation.");
      return;
    }

    const donatedQuantity = Math.max(0, Number(donationData.donatedQuantity));

    if (donatedQuantity <= 0) {
      alert("Donation quantity must be greater than 0.");
      return;
    }

    const requestBody = {
      donatedBy: donationData.donorName,
      donationDate: donationData.donationDate,
      bloodType: selectedRequest.requestedBloodGroup,
      donatedQuantity: donatedQuantity,
    };

    API.post("/donation/submit", requestBody)
      .then(() => {
        setSelectedRequest(null);

        // Fetch updated requests after donation
        API.get("/request/getrequest")
          .then((response) => {
            setRequests(response.data);
          })
          .catch((error) =>
            console.error("Error fetching updated requests:", error)
          );
      })
      .catch((error) => {
        console.error("Error submitting donation:", error);
      });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-10">
        {requests
          .filter(
            (request) =>
              request.requestedQuantity > (request.donatedQuantity || 0)
          )
          .map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <div className="flex justify-between">
                <span className="text-sm font-bold text-red-600">
                  {request.requestedBloodGroup}
                </span>
                {request.requestType ? (
                  <span className="text-red-600 font-semibold text-sm">
                    Urgent
                  </span>
                ) : null}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {request.requestedBy}
              </h2>
              <p className="text-sm text-gray-600">
                Requested for: {request.requestedFor}
              </p>
              <p className="text-sm text-gray-600">
                Needed by: {new Date(request.neededTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {request.requestedQuantity} unit(s)
              </p>
              <p className="text-sm text-gray-600">
                Donated: {request.donatedQuantity || 0} unit(s)
              </p>

              <button
                className="mt-4 bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => handleDonateClick(request)}
              >
                Donate Now
              </button>
            </div>
          ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              onClick={() => setSelectedRequest(null)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold">Donation Form</h2>
            <label className="block mt-2">Donated By:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={donationData.donorName}
              onChange={(e) =>
                setDonationData({ ...donationData, donorName: e.target.value })
              }
            />

            <label className="block mt-2">Donation Date & Time:</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={donationData.donationDate}
              onChange={(e) =>
                setDonationData({
                  ...donationData,
                  donationDate: e.target.value,
                })
              }
            />

            <label className="block mt-2">Blood Type:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={selectedRequest.requestedBloodGroup}
              readOnly
            />

            <label className="block mt-2">Quantity:</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={donationData.donatedQuantity}
              onChange={(e) =>
                setDonationData({
                  ...donationData,
                  donatedQuantity: Math.max(0, e.target.value),
                })
              }
            />

            <button
              className="mt-4 bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={handleSubmit}
            >
              Submit Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donors;
