import { userLogin, userRegister } from "./authActions";
import store from "../redux/store";
import { jwtDecode } from "jwt-decode";

export const handleLogin = async (
  email,
  password,
  role = null, // Make role parameter optional
  isGoogleLogin = false,
  googleData = null
) => {
  try {
    // Add detailed password debugging
    console.log("Login attempt with:", {
      email,
      passwordLength: password?.length,
      role: role || "(auto-detect)", // Show that role will be auto-detected if not provided
      isGoogleLogin,
    });

    // Ensure password is properly formatted before sending
    if (!isGoogleLogin && (!password || typeof password !== "string")) {
      return {
        success: false,
        message: "Invalid password format",
      };
    }

    const response = await store.dispatch(
      userLogin({
        email,
        password: password?.trim(), // Ensure no whitespace
        role,
        isGoogleLogin,
        googleData,
      })
    );

    // Check the response status
    if (response.meta.requestStatus === "fulfilled") {
      const userData = response.payload;

      if (userData?.token) {
        localStorage.setItem("token", userData.token);
        
        // Extract role from token payload or use the one from server response
        try {
          const decoded = jwtDecode(userData.token);
          console.log("Token payload:", decoded);
          
          // Save the role from token (more secure) or from response
          const userRole = decoded.role || userData?.user?.role || role;
          console.log("Setting user role:", userRole);
          
          if (userRole) {
            localStorage.setItem("role", userRole);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          // Fallback to response data
          if (userData.user?.role) {
            localStorage.setItem("role", userData.user.role);
          }
        }
        
        return { success: true, message: "Login Successful!", user: userData.user || userData };
      }
    }

    // Handle rejection with more detailed error
    console.error("Login failed:", {
      status: response.meta.requestStatus,
      error: response.payload,
    });

    return {
      success: false,
      message:
        response.payload ||
        "Authentication failed. Please check your credentials.",
    };
  } catch (error) {
    console.error("Login error details:", {
      error: error?.message,
      response: error?.response?.data,
    });

    return {
      success: false,
      message:
        error?.response?.data?.message || "Login failed. Please try again.",
    };
  }
};

export const handleRegister = async (
  donorName,
  recipientName,
  phone,
  address,
  email,
  password,
  role,
  isGoogleLogin = false
) => {
  try {
    console.log("Registering with payload:", {
      donorName,
      recipientName,
      phone,
      address,
      email,
      password,
      role,
      isGoogleLogin,
    });

    const response = await store.dispatch(
      userRegister({
        donorName,
        recipientName,
        phone,
        address,
        email,
        password,
        role,
        isGoogleLogin,
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
    console.log("Backend error response:", error.response?.data);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
