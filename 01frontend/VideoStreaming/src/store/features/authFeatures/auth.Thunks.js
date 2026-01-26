import { createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../../../api/auth.api";

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      return await authAPI.createAccount(formData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      return await authAPI.login(formData);
    } catch (error) {
      // console.log("frontend error",error);
      // console.log("data error", error.response?.data)
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.logout();
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* ================= CURRENT USER ================= */
export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.getCurrentUser();
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);

export const updateAccountDetails = createAsyncThunk(
  "auth/updateAccount",
  async (formData, { rejectWithValue }) => {
    //console.log("thunk",formData)
    try {
      return await authAPI.updateAccountDetails(formData);
    } catch (error) {
      //console.log("error",error);
      return rejectWithValue(error.response?.data?.message||"Not authenticated");
    }
  }
);
