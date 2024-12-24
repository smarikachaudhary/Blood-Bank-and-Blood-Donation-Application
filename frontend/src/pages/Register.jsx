import  { useState } from "react";
import { Link } from "react-router-dom";
import { handleRegister } from "../redux/authService";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [adminName, setAdminName] = useState("");
  const [donorName, setDonorName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  
    const handleRoleChange = (e) => {
      setRole(e.target.value);
    };
  
    const onSubmit = (e) => {
      e.preventDefault(); // Prevent page reload
      handleRegister(e, adminName, donorName, recipientName, hospitalName, phone, address, email, password, role);
    };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-[700px] w-[500px] transition-transform duration-700 ease-in-out transform hover:scale-105">
          <img
            src="/banner8.jpg"
            alt="login"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="p-10 w-[500px]">
          <h2 className="text-2xl font-bold text-gray-600 mb-5">Register</h2>
          <div className="flex justify-between mb-5">
            <label className="flex items-center">
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Admin
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="donor"
                checked={role === "donor"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Donor
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="recipient"
                checked={role === "recipient"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Recipient
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="hospital"
                checked={role === "hospital"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              Hospital
            </label>
          </div>
          <form className="space-y-5" onSubmit={onSubmit}>
  {/* Conditionally render the name field based on role */}
  {role === "admin" && (
    <div>
      <label htmlFor="adminName" className="block text-gray-600 mb-1">
        Admin Name
      </label>
      <input
        type="text"
        id="adminName"
        className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
      />
    </div>
  )}

  {role === "donor" && (
    <div>
      <label htmlFor="donorName" className="block text-gray-600 mb-1">
        Donor Name
      </label>
      <input
        type="text"
        id="donorName"
        className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
      />
    </div>
  )}

  {role === "recipient" && (
    <div>
      <label htmlFor="recipientName" className="block text-gray-600 mb-1">
        Recipient Name
      </label>
      <input
        type="text"
        id="recipientName"
        className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
      />
    </div>
  )}

  {role === "hospital" && (
    <div>
      <label htmlFor="hospitalName" className="block text-gray-600 mb-1">
        Hospital Name
      </label>
      <input
        type="text"
        id="hospitalName"
        className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
      />
    </div>
  )}

  {/* Other common input fields */}
  <div>
    <label htmlFor="email" className="block text-gray-600 mb-1">
      Email
    </label>
    <input
      type="email"
      id="email"
      className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div>
    <label htmlFor="password" className="block text-gray-600 mb-1">
      Password
    </label>
    <input
      type="password"
      id="password"
      className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <div>
    <label htmlFor="phone" className="block text-gray-600 mb-1">
      Phone Number
    </label>
    <input
      type="phone"
      id="phone"
      className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  </div>

  <div>
    <label htmlFor="address" className="block text-gray-600 mb-1">
      Address
    </label>
    <input
      type="address"
      id="address"
      className="w-full px-4 border py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </div>

  

  <button
    type="submit"
    className="w-full py-2 bg-[#800000] text-white font-bold rounded-md transition-transform duration-700 hover:bg-[#c60408] focus:outline-none focus:ring-2 focus:ring-[#800000] transform hover:scale-105"
  >
    Register
  </button>
  <div>
    <span>
      Already have an account?{" "}
      <Link to="/login" className="text-[#c60408]">
        Login
      </Link>
    </span>
  </div>
</form>

        </div>
      </div>
    </div> 
    
  )
}

export default Register