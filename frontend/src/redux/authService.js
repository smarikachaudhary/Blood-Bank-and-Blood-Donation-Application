import { userLogin, userRegister } from "./authActions";
import store from "../redux/store";

export const handleLogin = async (e, email, password, role) => {
  //e.preventDefault();
  try {
    if (!role || !email || !password) {
      return { success: false, message: "Please provide all fields" };
    }

    const response = await store.dispatch(userLogin({ email, password, role }));

    if (response.meta.requestStatus === "fulfilled") {
      return { success: true, message: "Login Successful!" };
    } else if (response.meta.requestStatus === "rejected") {
      return { success: false, message: response.payload };
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
  try {
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

    if (response.meta.requestStatus === "fulfilled") {
      return { success: true, message: "User Registered Successfully!" };
    } else if (response.meta.requestStatus === "rejected") {
      console.log("Rejected Payload:", response.payload); //debug
      return { success: false, message: response.payload };
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
