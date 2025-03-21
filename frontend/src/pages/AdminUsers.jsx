import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { useLocation } from "react-router-dom"; // To detect URL change

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // New state for document preview modal
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Role mapping for dynamic button text
  const roleMap = {
    donor: "Validate Donor",
    hospital: "Validate Hospital",
    recipient: "Validate Recipient",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/auth/all-users");
        // Filter out users with the role 'admin'
        const nonAdminUsers = response.data.users.filter(
          (user) => user.role !== "admin"
        );
        setUsers(nonAdminUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Detect if the sidebar is collapsed or not
  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]); // Detect when location changes

  const openModal = (userData) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      let response;
      if (selectedUser.role === "donor") {
        response = await API.post(`/users/validate-donor/${selectedUser._id}`);
      } else if (selectedUser.role === "hospital") {
        response = await API.post(
          `/users/validate-hospital/${selectedUser._id}`
        );
      } else if (selectedUser.role === "recipient") {
        response = await API.post(
          `/users/validate-recipient/${selectedUser._id}`
        );
      }

      if (response.status === 200) {
        alert(
          `${
            selectedUser.role.charAt(0).toUpperCase() +
            selectedUser.role.slice(1)
          } validated successfully!`
        );
      }
    } catch (error) {
      console.error(
        `Error validating ${selectedUser.role}:`,
        error.response?.data || error.message
      );
    }
  };

  // Function to handle document viewing (fetch from the database)
  const handleViewDocument = async (userId) => {
    try {
      const response = await API.get(
        `/upload/get-citizenship-document/${userId}`
      );
      const documentPath = response.data.documentUrl;

      if (documentPath) {
        const fullDocumentUrl = `http://localhost:8000/${documentPath.replace(
          /\\/g,
          "/"
        )}`;

        setSelectedDocument(fullDocumentUrl);
        setIsDocumentModalOpen(true);
      } else {
        alert("No document available to view.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Failed to fetch document.");
    }
  };

  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 ${
        isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"
      }`}
    >
      <AdminNavbar />
      <div className="flex flex-wrap items-center justify-between gap-10 m-[20px] pt-20">
        {/* Title */}
        <h1 className="text-[20px] font-semibold">All Users</h1>
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="m-[20px] text-center">Loading...</div>
      ) : users.length > 0 ? (
        <div className="m-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 shadow-lg border rounded-md bg-white flex flex-col"
            >
              <h2 className="font-semibold mb-2">
                {user.adminName ||
                  user.donorName ||
                  user.hospitalName ||
                  user.recipientName}
              </h2>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Phone: {user.phone || "N/A"}</p>
              <p>Address: {user.address || "N/A"}</p>
              {/* Only show View Document link if documentUrl is present */}
              {user.citizenshipDocument && (
                <a
                  href="#"
                  className="text-[#800000] mt-3 font-semibold"
                  onClick={() => handleViewDocument(user._id)} // Passing user ID to fetch the document
                >
                  View Document
                </a>
              )}
              <button
                className="bg-[#800000] text-white p-3 mt-5 rounded-md cursor-pointer font-semibold"
                onClick={() => openModal(user)}
              >
                View More
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="m-[20px] text-center">No users found.</div>
      )}

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg relative w-80 sm:w-96 md:w-[400px]">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="font-semibold mb-2 text-lg">
              {selectedUser.adminName ||
                selectedUser.donorName ||
                selectedUser.hospitalName ||
                selectedUser.recipientName}
            </h2>
            <p>Email: {selectedUser.email}</p>
            <p>Role: {selectedUser.role}</p>
            <p>Phone: {selectedUser.phone || "N/A"}</p>
            <p>Address: {selectedUser.address || "N/A"}</p>

            {/* Validate User Button */}
            <button
              className="bg-[#800000] text-white p-3 mt-5 rounded-md cursor-pointer font-semibold"
              onClick={handleRoleChange}
            >
              {roleMap[selectedUser.role]}{" "}
              {/* Dynamically change button text */}
            </button>
          </div>
        </div>
      )}

      {/* Modal for Document Preview */}
      {isDocumentModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg relative w-[80%] sm:w-[600px] md:w-[800px]">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setIsDocumentModalOpen(false)} // Close document modal
            >
              &times;
            </button>
            <h2 className="font-semibold mb-2 text-lg">Document</h2>

            {/* Displaying the document (assuming it's a PDF or an image) */}
            {selectedDocument.endsWith(".pdf") ? (
              <iframe
                src={selectedDocument}
                width="100%"
                height="500px"
                frameBorder="0"
                title="Document"
              />
            ) : (
              <img src={selectedDocument} alt="Document" className="w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
