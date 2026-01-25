import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../../api/auth.api";


export const watchHistory = createAsyncThunk("user/watchHistory",
    async (_,{rejectWithValue})=>{
        try {
            const response = await authApi.getWatchHistory();
            //console.log("thunkres",response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "watchHistory not found"
            );
        }
    }
)