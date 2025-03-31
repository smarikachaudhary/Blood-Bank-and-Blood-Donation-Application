import { userLogin, userRegister } from "./authActions";
import store from "../redux/store";

export const handleLogin = async (email, password, role) => {
  try {
    // Check if all fields are filled before sending the request
    if (!role || !email || !password) {
      return { success: false, message: "Please provide all fields" };
    }

    // Dispatch the login action
    const response = await store.dispatch(userLogin({ email, password, role }));

    // Check if the login request was successful
    if (response.meta.requestStatus === "fulfilled") {
      const userData = response.payload; // Assuming payload contains token or user info

      // Store token and role in localStorage for persistent login state
      if (userData?.token) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", role); // Save user role in localStorage as well
      }

      return { success: true, message: "Login Successful!" };
    } else {
      return { success: false, message: response.payload || "Login failed" };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export const handleRegister = async (
  //adminName,
  donorName,
  recipientName,
  hospitalName,
  phone,
  address,
  email,

  password,
  role
) => {
  try {
    const response = await store.dispatch(
      userRegister({
        // adminName,
        donorName,
        recipientName,
        hospitalName,
        phone,
        address,
        email,
        password,
        role,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      return { success: true, message: "User Registered Successfully!" };
    } else {
      return {
        success: false,
        message: response.payload || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
