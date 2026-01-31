import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authFeatures/auth.slice"
import channelReducer from "./features/channelFeatures/channel.Slice";
import historyReducer from "./features/historyFeatures/history.slice"
const store = configureStore({
    reducer:{
        auth:authReducer,
        channel: channelReducer,
        history: historyReducer,
    }
})

export default store