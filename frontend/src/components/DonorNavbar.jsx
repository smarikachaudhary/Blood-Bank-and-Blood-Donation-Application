import { FaSearch, FaBell, FaUserCircle, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import API from "../redux/API";
import getTokenAndEmail from "../redux/getTokenAndEmail";

const DonorNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  // const [showDocModal, setShowDocModal] = useState(false);
  const inputRef = useRef(null);

  // New state for document preview modal
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const userData = getTokenAndEmail();
  const donorId = userData?.userId;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!donorId) return;

      try {
        const res = await API.get(`/eligibility/notifications/${donorId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [donorId]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!donorId) return;

      try {
        const res = await API.get(
          `/upload/get-citizenship-document/${donorId}`
        );
        const documentPath = res.data.documentUrl;

        if (documentPath) {
          const fullDocumentUrl = `http://localhost:8000/${documentPath.replace(
            /\\/g,
            "/"
          )}`;
          setSelectedDocument(fullDocumentUrl);
          setDocumentUploaded(true); // Document exists
        } else {
          setDocumentUploaded(false); // No document uploaded
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocumentUploaded(false);
      }
    };

    fetchDocument();
  }, [donorId]);

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

  const hasUnreadNotifications = notifications.some((notif) => !notif.read);

  const toggleDropdown = async (dropdown) => {
    setActiveDropdown((prevState) =>
      prevState === dropdown ? null : dropdown
    );

    if (dropdown === "notifications" && hasUnreadNotifications) {
      try {
        await API.put(`/eligibility/notifications/mark-read/${donorId}`);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await API.post(
        `/upload/upload-citizenship/${donorId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload Success:", res.data);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="bg-gray-100 h-[60px] flex items-center justify-between px-6 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-2">
          <img src="/Logo.png" alt="Logo" className="w-[100px] h-[40px]" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(`Searching for: ${query}`);
          }}
          className="flex items-center bg-white rounded-full px-4 py-2 w-[300px] shadow-sm"
        >
          <FaSearch
            className="text-gray-400 mr-2 cursor-pointer"
            onClick={() => inputRef.current.focus()}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search now"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none text-sm w-full"
          />
        </form>

        <div className="flex items-center space-x-6 text-white">
          <div className="relative">
            <FaBell
              className="text-lg cursor-pointer"
              onClick={() => toggleDropdown("notifications")}
            />
            {hasUnreadNotifications && (
              <span className="absolute top-0 right-0 bg-red-600 rounded-full w-2 h-2"></span>
            )}
            {activeDropdown === "notifications" && (
              <div className="absolute right-0 mt-2 w-[250px] bg-white text-black shadow-lg rounded-md">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {notif.message}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <FaUserCircle
              className="text-2xl cursor-pointer"
              onClick={() => toggleDropdown("profile")}
            />
            {activeDropdown === "profile" && (
              <div className="absolute right-0 mt-2 w-[180px] bg-white text-black shadow-lg rounded-md">
                {documentUploaded && (
                  <div
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleViewDocument(donorId)}
                  >
                    View Document
                  </div>
                )}
                <div
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Upload Citizenship
                </div>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] relative">
            <FaTimes
              className="absolute top-2 right-2 text-gray-600 cursor-pointer text-lg"
              onClick={() => setShowUploadModal(false)}
            />
            <h2 className="text-lg font-semibold mb-4">Upload Citizenship</h2>
            <input
              type="file"
              className="border p-2 w-full"
              onChange={handleUpload}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#800000] text-white px-4 py-2 rounded"
                onClick={() => setShowUploadModal(false)}
              >
                Done
              </button>
            </div>
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
    </>
  );
};

export default DonorNavbar;
