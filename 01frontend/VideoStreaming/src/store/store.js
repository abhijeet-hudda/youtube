import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authFeatures/auth.slice"
import channelReducer from "./features/channelFeatures/channel.Slice";
const store = configureStore({
    reducer:{
        auth:authReducer,
        channel: channelReducer
    }
})

export default store