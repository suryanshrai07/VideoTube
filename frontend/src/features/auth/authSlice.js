import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : null,
    token : localStorage.getItem("token") || null,
    isAuthenticated : false,
    loading : false,
    error : null,
};

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        loginStart(state){
            console.log("login start...")
            state.loading = true;
            state.error = null;
        },

        loginSuccess(state,action){
            console.log("loginSucess :", action)
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token",action.payload.token);
        },

        loginFailure(state,action){
            console.log("loginFailure :", action)
            state.loading = false;
            state.error = action.payload;
        },

        signupStart(state){
            console.log("signup start ...")
            state.loading = true;
            state.error = null;
        },

        signupSuccess(state,action){
            console.log("signup sucess :",action)
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token",action.payload.token);
        },

        signupFailure(state,action){
            console.log("signup failure")
            state.user = null,
            state.error = action.payload;
        },

        logout(state){
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },

        clearError(state){
            state.error = null;
        }
    }
})

export const {
    loginStart,loginSuccess,loginFailure,
    signupStart,signupSuccess,signupFailure,
    logout,clearError
} = authSlice.actions;

export default authSlice.reducer;