import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../redux/authService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user data:", decoded);

      // Try to login with Google credentials
      const result = await handleLogin(
        decoded.email,
        "", // No password needed for Google login
        null, // No role needed
        true, // isGoogleLogin flag
        decoded // Pass the full decoded token
      );

      if (result?.success) {
        setMessage("Login Successful!");
        // Store additional user info if needed
        localStorage.setItem("userEmail", decoded.email);
        localStorage.setItem("userName", decoded.name);

        // Get the role from local storage that was saved during the login process
        const userRole = localStorage.getItem("role");
        console.log("Navigating based on role (Google login):", userRole);
        
        // Navigate based on the user's actual role
        switch (userRole) {
          case "admin":
            navigate("/admin");
            break;
          case "donor":
            navigate("/donors");
            break;
          case "recipient":
            navigate("/recipients");
            break;
          default:
            // If role is unknown, redirect to home
            navigate("/");
        }
      } else {
        console.error("Login failed:", result);
        setMessage(
          result?.message ||
            "Account not found. Please register first with this Google account."
        );
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      if (error.response?.status === 404) {
        setMessage(
          "Server endpoint not found. Please check your backend configuration."
        );
      } else {
        setMessage(
          error.response?.data?.message ||
            "Failed to login with Google. Please try again or use email/password."
        );
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please provide all fields.");
      return;
    }

    try {
      // Trim the password before sending
      const trimmedPassword = password.trim();
      console.log("Attempting login with:", {
        email,
        passwordLength: trimmedPassword.length,
      });

      const result = await handleLogin(email, trimmedPassword, null, false);

      if (result?.success) {
        setMessage("Login Successful!");
        
        // Get the role from local storage that was saved during the login process
        const userRole = localStorage.getItem("role");
        console.log("Navigating based on role:", userRole);
        
        // Navigate based on the user's actual role
        switch (userRole) {
          case "admin":
            navigate("/admin");
            break;
          case "donor":
            navigate("/donors");
            break;
          case "recipient":
            navigate("/recipients");
            break;
          default:
            // If role is unknown, redirect to home
            navigate("/");
        }
      } else {
        console.error("Login failed:", result);
        setMessage(result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-[500px] w-[500px] transition-transform duration-700 ease-in-out transform hover:scale-105">
          <img
            src="/banner1.jpg"
            alt="register"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="p-10 w-[500px]">
          <div className="flex items-center justify-center mb-4">
            <img src="/Logo.png" alt="DonateHope Logo" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-[#800000] mb-5">Login</h2>
          <form className="space-y-5" onSubmit={onSubmit}>
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
            <button
              type="submit"
              className="w-full py-2 bg-[#800000] text-white font-bold rounded-md transition-transform duration-700 hover:bg-[#c60408] focus:outline-none focus:ring-2 focus:ring-[#800000] transform hover:scale-105"
            >
              Login
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
                onError={(error) => {
                  console.error("Login Failed:", error);
                  setMessage("Google login failed. Please try again.");
                }}
                useOneTap={false}
                theme="filled_blue"
                text="signin_with"
                shape="rectangular"
                cookiePolicy="single_host_origin"
                isSignedIn={false}
                auto_select={false}
                ux_mode="popup"
                context="signin"
                flow="auth-code"
              />
            </div>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  message === "Login Successful!"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <div>
              <span>
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-[#c60408]">
                  Register
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
