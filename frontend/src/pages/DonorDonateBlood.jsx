import { useEffect, useState } from "react";
import DonorNavbar from "../components/DonorNavbar";

import { useLocation } from "react-router-dom"; 

const DonorDonateBlood = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains('w-[80px]')); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]); 
  
  return (
    <div className={`w-full px-3 sm:px-6 lg:px-8 ${isSidebarCollapsed ? "ml-[10px]" : "ml-[10px]"}`}>
      <DonorNavbar />

import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../redux/API";
import { getTokenAndEmail } from "../redux/getTokenAndEmail";

const DonorDonateBlood = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: "",
    donorEmail: "",
    healthDeclaration: false,
    lastDonationDate: "",
  });
  const [errors, setErrors] = useState({}); // Add errors state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      setIsSidebarCollapsed(sidebar.classList.contains("w-[80px]"));
    }
    const userData = getTokenAndEmail();
    console.log("User Data:", userData); // Log to check if email is returned
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        donorEmail: userData.email, // Ensure correct field name
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodType)
      newErrors.bloodType = "Please select your blood type";
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (formData.quantity < 20) {
      newErrors.quantity = "Minimum donation is 20ml";
    } else if (formData.quantity > 500) {
      newErrors.quantity = "Maximum donation is 500ml";
    }
    if (!formData.lastDonationDate)
      newErrors.lastDonationDate = "Please provide last donation date";
    if (!formData.healthDeclaration)
      newErrors.healthDeclaration = "You must confirm health status";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const submissionData = {
        ...formData,
        lastDonationDate: new Date(formData.lastDonationDate).toISOString(),
        status: "pending",
      };

      console.log("Submitting:", submissionData); // Check this log to verify the data being submitted

      const response = await API.post("/storage/donate", submissionData);
      console.log("Response:", response.data);

      toast.success("Blood donation submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        bloodType: "",
        quantity: "",
        donorEmail: formData.email,
        lastDonationDate: "",
        healthDeclaration: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed", {
        position: "top-right",
        autoClose: 3000,
      });
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
      <div className="flex items-center justify-center m-[30px] pt-10">
        <h1 className="text-[20px] font-semibold">Blood Donation Form</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        {/* Blood Type */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Blood Type *
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.bloodType
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select your blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.bloodType && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
          )}
        </div>

        {/* Donation Quantity */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Donation Amount (ml) *
          </label>
          <input
            type="number"
            name="quantity"
            min="20"
            max="500"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.quantity
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Between 20-500ml"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
          )}
        </div>

        {/* Email (auto-filled but visible) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.donorEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            readOnly
          />
        </div>

        {/* Last Donation Date */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Last Donation Date *
          </label>
          <input
            type="date"
            name="lastDonationDate"
            value={formData.lastDonationDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.lastDonationDate
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.lastDonationDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastDonationDate}
            </p>
          )}
        </div>

        {/* Health Declaration */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="healthDeclaration"
              checked={formData.healthDeclaration}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-gray-700 font-semibold">
              I confirm that I am in good health and meet all donation
              requirements *
            </label>
          </div>
          {errors.healthDeclaration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.healthDeclaration}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#800000] text-white py-3 rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Donation"}
        </button>
      </form>

    </div>
  );
};

export default DonorDonateBlood;
