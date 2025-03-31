import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

//login
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", { role, email, password });

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
      // adminName,
      donorName,
      recipientName,
      hospitalName,
      phone,
      address,
      email,
      password,
      role,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await API.post("/auth/register", {
        // adminName,
        donorName,
        recipientName,
        hospitalName,
        phone,
        address,
        email,
        password,
        role,
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
