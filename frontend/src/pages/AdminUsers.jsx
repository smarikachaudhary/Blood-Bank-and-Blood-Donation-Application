import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../redux/API";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState('citizenship');
  const [isRebutModalOpen, setIsRebutModalOpen] = useState(false);
  const [rebutReason, setRebutReason] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const roleMap = {
    donor: "Validate Donor",
    recipient: "Validate Recipient",
    donor_rebut: "Refute Donor",
    recipient_rebut: "Refute Recipient",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users/all-users");
        if (response.data && response.data.users) {
          // Sort users by createdAt timestamp, newest first
          const sortedUsers = response.data.users.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUsers(sortedUsers);
        } else {
          console.error("Invalid response format:", response.data);
          toast.error("Failed to fetch users: Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
  }, [useLocation()]);

  const openModal = (userData) => {
    setSelectedUser(userData);
    setBloodGroup(""); // Reset blood group when opening modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRebut = async () => {
    if (!selectedUser) return;

    try {
      const response = await API.post(`/users/rebut-user/${selectedUser._id}`, {
        reason: rebutReason,
      });

      if (response.status === 200) {
        toast.success(`Refutation successfull!`);
        closeModal();
        setIsRebutModalOpen(false);
        setRebutReason("");
        // Refresh the users list
        const fetchUsers = async () => {
          try {
            const response = await API.get("/users/all-users");
            if (response.data && response.data.users) {
              setUsers(response.data.users);
            }
          } catch (error) {
            console.error("Error refreshing users:", error);
          }
        };
        fetchUsers();
      }
    } catch (error) {
      console.error("Error rebutting user:", error);
      toast.error(error.response?.data?.message || "Failed to rebut user");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.querySelector('.document-modal');
      if (modal && !modal.contains(event.target)) {
        setIsDocumentModalOpen(false);
      }
    };

    if (isDocumentModalOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDocumentModalOpen]);

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      let response;
      let endpoint = "";
      let requestData = {};

      switch (selectedUser.role) {
        case "donor":
          // For donors, validate that blood group is selected
          if (!bloodGroup) {
            toast.error("Please select a blood group before validating");
            return;
          }
          endpoint = `/users/validate-donor/${selectedUser._id}`;
          requestData = { bloodType: bloodGroup };
          break;
        case "recipient":
          endpoint = `/users/validate-recipient/${selectedUser._id}`;
          break;
        default:
          throw new Error("Invalid role");
      }

      response = await API.post(endpoint, requestData);

      if (response.status === 200) {
        toast.success(
          `${
            selectedUser.role.charAt(0).toUpperCase() +
            selectedUser.role.slice(1)
          } validated successfully!`
        );
        closeModal();
        
        // Refresh the users list to show updated data
        const fetchUsers = async () => {
          try {
            const response = await API.get("/users/all-users");
            if (response.data && response.data.users) {
              // Sort users by createdAt timestamp, newest first
              const sortedUsers = response.data.users.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              setUsers(sortedUsers);
            }
          } catch (error) {
            console.error("Error refreshing users:", error);
          }
        };
        fetchUsers();
      }
    } catch (error) {
      console.error(
        `Error validating ${selectedUser.role}:`,
        error.response?.data || error.message
      );

      // Display the specific error message from the backend
      const errorMessage =
        error.response?.data?.message || "Failed to validate user";
      toast.error(errorMessage);
    }
  };

  const handleViewDocument = async (userId, type = 'citizenship') => {
    try {
      const endpoint = type === 'citizenship' 
        ? `/upload/get-citizenship-document/${userId}`
        : `/upload/get-blood-group-card/${userId}`;
        
      const response = await API.get(endpoint);
      const documentPath = response.data.documentUrl;

      if (documentPath) {
        const fullDocumentUrl = `http://localhost:8000/${documentPath.replace(
          /\\/g,
          "/"
        )}`;
        setSelectedDocument(fullDocumentUrl);
        setDocumentType(type);
        setIsDocumentModalOpen(true);
      } else {
        toast.info(`No ${type === 'citizenship' ? 'citizenship document' : 'blood group card'} available to view.`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} document:`, error);
      toast.error(`Failed to fetch ${type === 'citizenship' ? 'citizenship document' : 'blood group card'}`);
    }
  };

  return (
    <div
      className={`w-full px-2 sm:px-4 md:px-6 lg:px-8 ${
        isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"
      }`}
    >
      <AdminNavbar />
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 md:gap-8 m-4 sm:m-6 md:m-8 pt-16 sm:pt-20">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
          All Users
        </h1>
      </div>

      {loading ? (
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]"></div>
          </div>
        </div>
      ) : users.length > 0 ? (
        <div className="m-4 sm:m-6 md:m-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-3 sm:p-4 shadow-lg border rounded-md bg-white flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-semibold text-sm sm:text-base mb-2 break-words">
                  {user.adminName || user.donorName || user.recipientName}
                </h2>
                {user.isValidated && user.role === "donor" && user.validatedData && user.validatedData.bloodType && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {user.validatedData.bloodType}
                  </span>
                )}
              </div>
              <div className="space-y-1 sm:space-y-2 text-sm">
                <p className="break-words">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span> {user.role}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {user.phone || "N/A"}
                </p>
                <p className="break-words">
                  <span className="font-medium">Address:</span>{" "}
                  {user.address || "N/A"}
                </p>
              </div>
              <div className="flex flex-col mt-3 gap-2">
                {user.citizenshipDocument && (
                  <div className="flex items-center gap-1">
                    <a
                      href="#"
                      className="text-[#800000] font-semibold text-sm hover:underline flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewDocument(user._id, 'citizenship');
                      }}
                    >
                      <FaEye className="text-sm" />
                      View Citizenship
                    </a>
                  </div>
                )}
                {user.bloodGroupCard && (
                  <div className="flex items-center gap-1">
                    <a
                      href="#"
                      className="text-[#800000] font-semibold text-sm hover:underline flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewDocument(user._id, 'blood-group');
                      }}
                    >
                      <FaEye className="text-sm" />
                      View Blood Group Card
                    </a>
                  </div>
                )}
              </div>
              <button
                className={`${
                  user.isValidated
                    ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                    : user.rebutReason
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-[#800000] hover:bg-[#700000] cursor-pointer"
                } text-white p-2 sm:p-3 mt-4 rounded-md font-semibold text-sm sm:text-base transition-colors duration-300 ${
                  user.isValidated ? "opacity-90" : ""
                }`}
                onClick={() => {
                  if (user.isValidated) {
                    toast.info(user.message);
                  } else {
                    openModal(user);
                  }
                }}
                disabled={user.isValidated}
              >
                {user.isValidated
                  ? "Validated"
                  : user.rebutReason
                  ? "Refuted"
                  : "View More"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="m-4 sm:m-6 md:m-8 text-center">No users found.</div>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg relative w-full max-w-sm sm:max-w-md md:max-w-lg">
            <button
              className="absolute top-2 right-2 text-xl font-bold hover:text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="font-semibold mb-3 text-lg">
              {selectedUser.adminName ||
                selectedUser.donorName ||
                selectedUser.recipientName}
            </h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p>
                <span className="font-medium">Email:</span> {selectedUser.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {selectedUser.role}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedUser.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedUser.address || "N/A"}
              </p>
            </div>

            {selectedUser.role === "donor" && (
              <div className="mt-4 mb-3">
                <label className="block text-sm font-medium mb-1">Blood Group *</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
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
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <button
                className="bg-[#800000] text-white p-3 rounded-md cursor-pointer font-semibold flex-1 hover:bg-[#700000] transition-colors duration-300"
                onClick={handleRoleChange}
              >
                {roleMap[selectedUser.role]}
              </button>
              <button
                className="bg-red-600 text-white p-3 rounded-md cursor-pointer font-semibold flex-1 hover:bg-red-700 transition-colors duration-300"
                onClick={() => {
                  setSelectedUser(selectedUser);
                  setIsRebutModalOpen(true);
                }}
              >
                {roleMap[`${selectedUser.role}_rebut`]}
              </button>
            </div>
          </div>
        </div>
      )}

      {isRebutModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg relative w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-xl font-bold hover:text-gray-600"
              onClick={() => {
                setIsRebutModalOpen(false);
                setRebutReason("");
              }}
            >
              &times;
            </button>
            <h2 className="font-semibold mb-4 text-lg">Refute User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reason for Refutation
                </label>
                <textarea
                  value={rebutReason}
                  onChange={(e) => setRebutReason(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Enter reason for rebutting this user..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  onClick={handleRebut}
                >
                  Submit Refutation
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                  onClick={() => {
                    setIsRebutModalOpen(false);
                    setRebutReason("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDocumentModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg relative w-full max-w-3xl document-modal">
            <button
              className="absolute top-2 right-2 text-xl font-bold hover:text-gray-600"
              onClick={() => setIsDocumentModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="font-semibold mb-3 text-lg">{documentType === 'citizenship' ? 'Citizenship Document' : 'Blood Group Card'}</h2>
            <div className="max-h-[80vh] overflow-auto">
              {selectedDocument.endsWith(".pdf") ? (
                <iframe
                  src={selectedDocument}
                  width="100%"
                  height="500px"
                  frameBorder="0"
                  title="Document"
                  className="w-full"
                />
              ) : (
                <img
                  src={selectedDocument}
                  alt="Document"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
