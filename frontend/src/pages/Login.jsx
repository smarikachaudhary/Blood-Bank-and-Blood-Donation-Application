import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../redux/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const onSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password || !role) {
    setMessage("Please provide all fields.");
    return;
  }

  const result = await handleLogin(email, password, role); // Call login service
  if (result?.success) {
    setMessage("Login Successful!");
    // Redirect user based on role
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "donor":
        navigate("/donors");
        break;
      case "recipient":
        navigate("/recipients");
        break;
      case "hospital":
        navigate("/hospital");
        break;
      default:
        setMessage("Invalid role.");
    }
  } else {
    setMessage(result?.message || "Login failed. Please try again.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-[500px] w-[500px] transition-transform duration-700 ease-in-out transform hover:scale-105">
          <img src="/banner1.jpg" alt="register" className="object-cover h-full w-full" />
        </div>
        <div className="p-10 w-[500px]">
          <h2 className="text-2xl font-bold text-gray-600 mb-5">Login</h2>
          <div className="flex justify-between mb-5">
            {["admin", "donor", "recipient", "hospital"].map((r) => (
              <label key={r} className="flex items-center">
                <input
                  type="radio"
                  value={r}
                  checked={role === r}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>
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
            {message && (
              <p
                className={`mt-2 text-sm ${
                  message === "Login Successful!" ? "text-green-600" : "text-red-600"
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
