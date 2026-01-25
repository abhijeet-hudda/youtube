import { createSlice } from "@reduxjs/toolkit";
import { watchHistory } from "./history.Thunks";

const initialState = {
    historyVideo:[],
    error:null,
    isLoading:null
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(watchHistory.pending,(state)=>{
            state.isLoading = true;
            state.error = null
        })
        .addCase(watchHistory.fulfilled,(state, action)=>{
            state.isLoading = false;
            //console.log("action",action.payload)
            state.historyVideo = action.payload
            state.error = null;
        })
        .addCase(watchHistory.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })

    }
})

export default historySlice.reducer