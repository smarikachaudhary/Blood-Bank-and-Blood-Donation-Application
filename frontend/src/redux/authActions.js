import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

//login
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password, role, isGoogleLogin }, { rejectWithValue }) => {
    try {
      // Prepare request data - only include role if it's provided
      const requestData = {
        email,
        password,
        isGoogleLogin,
      };
      
      // Only add role if it's explicitly provided (not null or undefined)
      if (role) {
        requestData.role = role;
      }
      
      const { data } = await API.post("/auth/login", requestData);

      // Store token
      if (data.success) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
      donorName,
      recipientName,
      phone,
      address,
      email,
      password,
      role,
      isGoogleLogin,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await API.post("/auth/register", {
        donorName,
        recipientName,
        phone,
        address,
        email,
        password,
        role,
        isGoogleLogin,
      });
      if (data?.success) {
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async ({ rejectWithValue }) => {
    try {
      const res = await API.get("/auth/current-user");
      if (res.data) {
        return res?.data;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
