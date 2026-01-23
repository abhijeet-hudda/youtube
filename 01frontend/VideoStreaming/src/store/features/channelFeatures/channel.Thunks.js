import authApi from "../../../api/auth.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userChannel = createAsyncThunk(
  "channel/profile",
  async (username, { rejectWithValue }) => {
    try {
      //console.log(username);
      const response = await authApi.getUserChannelProfile(username);
      //console.log("channel response ", response)
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "channel not found");
    }
  },
);
