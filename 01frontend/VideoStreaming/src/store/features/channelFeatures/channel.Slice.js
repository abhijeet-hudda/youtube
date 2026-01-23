import { createSlice } from "@reduxjs/toolkit";
import { userChannel } from "./channel.Thunks";

const initialState = {
    channelProfile: null,
    isLoading: false,
    error: null,
}

const channelSlice = createSlice({
    name:"channel",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(userChannel.pending,(state,action)=>{
            state.isLoading = true;
            state.error = null;
        })
        .addCase(userChannel.fulfilled,(state,action)=>{
            state.channelProfile = action.payload.data
            state.isLoading = false;
            state.error = null
        })
        .addCase(userChannel.rejected, (state,action)=>{
            state.isLoading = false;
            state.error = action.payload
        })
    }
})

export default channelSlice.reducer;