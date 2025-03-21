import { FaSearch, FaBell, FaUserCircle, FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import API from "../redux/API";
import getTokenAndEmail from "../redux/getTokenAndEmail";

const RecipientNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requestedFor: "",
    requestedBy: "",
    requestedDateTime: "",
    requestedBloodGroup: "",
    requestedQuantity: "",
    neededTime: "",
    requestType: false,
    alreadyCollected: false,
  });
  const inputRef = useRef(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
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
                      htmlFor="requestedFor"
                      className="block text-sm text-black font-medium mb-1"
                    >
                      Requested By:
                    </label>
                    <input
                      type="text"
                      name="requestedBy"
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
                      type="text"
                      name="requestedFor"
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
                      Date & Time:
                    </label>
                    <input
                      type="datetime-local"
                      name="requestedDateTime"
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
                      Blood Group:
                    </label>
                    <select
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
                      htmlFor="requestedFor"
                      className="block text-sm text-black font-medium mb-1"
                    >
                      Quantity:
                    </label>
                    <input
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
                      htmlFor="requestedFor"
                      className="block text-sm text-black font-medium mb-1"
                    >
                      Needed Till:
                    </label>
                    <input
                      type="datetime-local"
                      name="neededTime"
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                      required
                    />
                  </div>
                  <div className="pb-3">
                    <label className="flex items-center text-black">
                      <input
                        type="checkbox"
                        name="requestType"
                        checked={formData.requestType}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Urgent Request
                    </label>
                  </div>
                  {/* <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      name="alreadyCollected"
                      onChange={handleChange}
                      className="mr-2 "
                    />{" "}
                    Already Collected
                  </label> */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#800000] text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
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
            className="text-gray-500 text-2xl cursor-pointer"
            onClick={() => toggleDropdown("profile")}
          />
          {activeDropdown === "profile" && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white text-black shadow-lg rounded-md">
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Profile
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
  );
};

export default RecipientNavbar;
