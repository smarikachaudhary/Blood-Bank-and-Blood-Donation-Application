import { userLogin, userRegister } from "./authActions";
import store from "../redux/store";

export const handleLogin = async (e, email, password, role) => {
  e.preventDefault();
  try {
    if (!role || !email || !password) {
      return alert("Please provide all fields");
    }

    // Dispatch login action and await the result
    const response = await store.dispatch(userLogin({ email, password, role }));

    if (response.meta.requestStatus === "fulfilled") {
      alert("Login Successful!");
    } else if (response.meta.requestStatus === "rejected") {
      // Use the error message from the backend
      alert(`Error: ${response.payload}`);
    }
  } catch (error) {
    alert("An unexpected error occurred. Please try again.");
    console.error("Login Error:", error);
  }
};

export const handleRegister = async (
  e,
  adminName,
  donorName,
  recipientName,
  hospitalName,
  phone,
  address,
  email,
  password,
  role
) => {
  e.preventDefault();
  try {
    // Validation for missing fields
    if (!role || !email || !password) {
      return alert("Please provide all required fields");
    }

    // Dispatch register action
    const response = await store.dispatch(
      userRegister({
        adminName,
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

    // Feedback upon successful registration (optional)
    if (response.meta.requestStatus === "fulfilled") {
      alert("User Registered Successfully!");
    } else if (response.meta.requestStatus === "rejected") {
      // Use the error message from the backend
      alert(`Error: ${response.payload}`);
    }
  } catch (error) {
    alert("An unexpected error occurred. Please try again.");
    console.error("Registration Error:", error);
  }
};
