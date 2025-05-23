import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../redux/authService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [donorName, setDonorName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // New states for Google signup
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    console.log("Selected Role:", e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Current Role:", role);

    // Validate required fields
    if (
      !email ||
      (!password && !isGoogleSignup) ||
      !role ||
      !address ||
      !phone
    ) {
      setMessage("Please provide all fields.");
      setIsSuccess(false);
      return;
    }

    // Conditionally check if role-specific fields are filled
    if (role === "donor" && !donorName) {
      setMessage("Donor name is required.");
      setIsSuccess(false);
      return;
    }
    if (role === "recipient" && !recipientName) {
      setMessage("Recipient name is required.");
      setIsSuccess(false);
      return;
    }

    const result = await handleRegister(
      donorName,
      recipientName,
      phone,
      address,
      email,
      password,
      role,
      isGoogleSignup
    );

    // Set the message and handle success case
    setMessage(result.message);
    setIsSuccess(result.success);

    if (result.success) {
      // Show success message for 1.5 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      // Clear error message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);

      // Store Google user data and show the second step form
      setGoogleUserData({
        email: decoded.email,
        name: decoded.name,
      });
      setEmail(decoded.email);
      if (role === "donor") {
        setDonorName(decoded.name);
      } else {
        setRecipientName(decoded.name);
      }
      setIsGoogleSignup(true);
    } catch (error) {
      console.error("Google Sign-up Error:", error);
      setMessage("Failed to sign up with Google. Please try again.");
      setIsSuccess(false);
    }
  };

  if (isGoogleSignup && googleUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden pr-9">
          <div className="h-[550px] w-[350px] transition-transform duration-700 ease-in-out transform hover:scale-105">
            <img
              src="/banner8.jpg"
              alt="register"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="p-4 w-[350px]">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/Logo.png"
                alt="DonateHope Logo"
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-lg font-semibold text-[#800000] mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Please provide the remaining required information
            </p>
            <form onSubmit={onSubmit} className="space-y-2">
              <div>
                <label className="block text-gray-600 mb-0.5 text-xs">
                  Role
                </label>
                <div className="flex gap-4 text-sm">
                  {["donor", "recipient"].map((roleOption) => (
                    <label className="flex items-center" key={roleOption}>
                      <input
                        type="radio"
                        value={roleOption}
                        checked={role === roleOption}
                        onChange={(e) => {
                          handleRoleChange(e);
                          if (e.target.value === "donor") {
                            setDonorName(googleUserData.name);
                            setRecipientName("");
                          } else {
                            setRecipientName(googleUserData.name);
                            setDonorName("");
                          }
                        }}
                        className="mr-1"
                      />
                      {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-0.5 text-xs">
                  {role === "donor" ? "Donor Name" : "Recipient Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={role === "donor" ? donorName : recipientName}
                  onChange={(e) => {
                    if (role === "donor") {
                      setDonorName(e.target.value);
                    } else {
                      setRecipientName(e.target.value);
                    }
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-0.5 text-xs">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-0.5 text-xs">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-4 text-sm bg-[#800000] text-white font-bold rounded-md transition-transform duration-700 hover:bg-[#c60408] focus:outline-none focus:ring-1 focus:ring-[#800000] transform hover:scale-105"
              >
                Complete Registration
              </button>

              {message && (
                <p
                  className={`mt-0.5 text-xs ${
                    isSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden pr-9">
        <div className="h-[550px] w-[350px] transition-transform duration-700 ease-in-out transform hover:scale-105">
          <img
            src="/banner8.jpg"
            alt="register"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="p-4 w-[350px]">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/Logo.png"
              alt="DonateHope Logo"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-lg font-semibold text-[#800000] mb-2">
            Register
          </h2>
          <div className="flex justify-between mb-2 text-sm">
            {["donor", "recipient"].map((roleOption) => (
              <label className="flex items-center" key={roleOption}>
                <input
                  type="radio"
                  value={roleOption}
                  checked={role === roleOption}
                  onChange={handleRoleChange}
                  className="mr-1"
                />
                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </label>
            ))}
          </div>
          <form className="space-y-2" onSubmit={onSubmit}>
            {role === "donor" && (
              <div>
                <label
                  htmlFor="donorName"
                  className="block text-gray-600 mb-0.5 text-xs"
                >
                  Donor Name
                </label>
                <input
                  type="text"
                  id="donorName"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>
            )}
            {role === "recipient" && (
              <div>
                <label
                  htmlFor="recipientName"
                  className="block text-gray-600 mb-0.5 text-xs"
                >
                  Recipient Name
                </label>
                <input
                  type="text"
                  id="recipientName"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 mb-0.5 text-xs"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-600 mb-0.5 text-xs"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-600 mb-0.5 text-xs"
              >
                Phone Number
              </label>
              <input
                type="phone"
                id="phone"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-600 mb-0.5 text-xs"
              >
                Address
              </label>
              <input
                type="address"
                id="address"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mb-3 text-sm bg-[#800000] text-white font-bold rounded-md transition-transform duration-700 hover:bg-[#c60408] focus:outline-none focus:ring-1 focus:ring-[#800000] transform hover:scale-105"
            >
              Register
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Login Failed");
                  setMessage("Google Sign-up failed. Please try again.");
                  setIsSuccess(false);
                }}
                useOneTap
                theme="filled_blue"
                text="signup_with"
                shape="rectangular"
              />
            </div>

            {message && (
              <p
                className={`mt-0.5 text-xs ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <div>
              <span className="text-xs">
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
  );
};

export default Register;
