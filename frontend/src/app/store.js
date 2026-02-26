import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReucer from "../features/videos/videoSlice";

const store = configureStore({
    reducer : {
        auth : authReducer,
        videos : videoReucer,
    }
});

export default store;