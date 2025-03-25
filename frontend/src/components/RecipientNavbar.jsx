import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import API from "../redux/API";
import getTokenAndEmail from "../redux/getTokenAndEmail";

const RecipientNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const userData = getTokenAndEmail();
  const recipientId = userData?.userId;

  const [formData, setFormData] = useState({
    requestedFor: "",
    recipientEmail: userData?.email || "",
    recipientId: userData?.userId || "",
    requestedBy: "",
    requestedDateTime: "",
    requestedBloodGroup: "",
    requestedQuantity: "",
    neededTime: "",
    requestType: false,
    alreadyCollected: false,
  });

  const inputRef = useRef(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!recipientId) return;
      try {
        const res = await API.get(`/eligibility/notifications/${recipientId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [recipientId]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!recipientId) return;

      try {
        const res = await API.get(
          `/upload/get-citizenship-document/${recipientId}`
        );
        const documentPath = res.data.documentUrl;

        if (documentPath) {
          const fullDocumentUrl = `http://localhost:8000/${documentPath.replace(
            /\\/g,
            "/"
          )}`;
          setSelectedDocument(fullDocumentUrl);
          setDocumentUploaded(true);
        } else {
          setDocumentUploaded(false);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocumentUploaded(false);
      }
    };

    fetchDocument();
  }, [recipientId]);

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

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prevState) =>
      prevState === dropdown ? null : dropdown
    );
  };

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/request/createrequest", formData);
      if (response.status === 201) {
        console.log("Blood request submitted successfully:", response.data);
        setShowForm(false);
      }
    } catch (error) {
      console.error(
        "Error submitting blood request:",
        error.response?.data || error.message
      );
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await API.post(
        `/upload/upload-citizenship/${recipientId}`,
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
        <img src="/Logo.png" alt="Logo" className="w-[100px] h-[40px]" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(`Searching for: ${query}`);
          }}
          className="flex items-center bg-white rounded-full px-4 py-2 w-[300px] shadow-sm"
        >
          <FaSearch
            className="text-gray-500 mr-2 cursor-pointer"
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

        <div className="flex items-center space-x-6 text-black">
          <div className="relative">
            <FaPlus
              className="text-gray-500 cursor-pointer"
              onClick={toggleForm}
            />
            {showForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="bg-white p-6 rounded-md w-[400px] shadow-lg relative">
                  <h1 className="text-lg text-black font-semibold pb-3">
                    Make Blood Request
                  </h1>
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="pb-3">
                      <label
                        htmlFor="requestedBy"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Requested By:
                      </label>
                      <input
                        id="requestedBy"
                        type="text"
                        name="requestedBy"
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        required
                      />
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="recipientEmail"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Recipient Email:
                      </label>
                      <input
                        id="recipientEmail"
                        type="email"
                        name="recipientEmail"
                        value={formData.recipientEmail}
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        required
                      />
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="requestedFor"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Requested For:
                      </label>
                      <input
                        id="requestedFor"
                        type="text"
                        name="requestedFor"
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        required
                      />
                    </div>

                    <div className="pb-3">
                      <label
                        htmlFor="requestedDateTime"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Date & Time:
                      </label>
                      <input
                        id="requestedDateTime"
                        type="datetime-local"
                        name="requestedDateTime"
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        required
                      />
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="requestedBloodGroup"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Blood Group:
                      </label>
                      <select
                        id="requestedBloodGroup"
                        name="requestedBloodGroup"
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-black"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="requestedQuantity"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Quantity:
                      </label>
                      <input
                        id="requestedQuantity"
                        type="number"
                        name="requestedQuantity"
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        min="1"
                        required
                      />
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="neededTime"
                        className="block text-sm text-black font-medium mb-1"
                      >
                        Needed Till:
                      </label>
                      <input
                        id="neededTime"
                        type="datetime-local"
                        name="neededTime"
                        onChange={handleChange}
                        className="w-full border rounded p-1"
                        required
                      />
                    </div>
                    <div className="pb-3">
                      <label
                        htmlFor="requestType"
                        className="flex items-center text-black"
                      >
                        <input
                          id="requestType"
                          type="checkbox"
                          name="requestType"
                          checked={formData.requestType}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Urgent Request
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-gray-500 text-xl absolute top-2 right-2"
                    >
                      &times;
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#800000] text-white rounded mt-4"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <FaBell
              className="text-gray-500 cursor-pointer"
              onClick={() => toggleDropdown("notifications")}
            />
            {hasUnreadNotifications && (
              <span className="absolute top-0 right-0 bg-red-600 rounded-full w-2 h-2"></span>
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
                    onClick={() => handleViewDocument(recipientId)}
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

      {isDocumentModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg relative w-[80%] sm:w-[600px] md:w-[800px]">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setIsDocumentModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="font-semibold mb-2 text-lg">Document</h2>

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

export default RecipientNavbar;
