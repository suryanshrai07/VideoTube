import { axiosInstance } from "../../utilities/axios";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailed,
} from "./authSlice";

const checkAuthUser = () => async (dispatch) => {
  dispatch(checkAuthStart());
  const token = localStorage.getItem("token") || "";

  try {
    const { data } = await axiosInstance.get("/users/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      withCredentials : true
    });

    console.log("checkAuth data : ", data.data);
    dispatch(checkAuthSuccess({ user: data.data }));
  } catch (err) {
    console.log("check auth error : ", err);
    dispatch(checkAuthFailed());
  }
};

const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const { data } = await axiosInstance.post("/users/login", credentials);
    localStorage.setItem("token", data.data.accessToken);
    dispatch(loginSuccess({ user: data.data.user, token: data.data.accessToken }));
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "Login failed"));
  }
};

const signupUser = (userData) => async (dispatch) => {
  dispatch(signupStart());
  try {
    const { data } = await axiosInstance.post("/users/register", userData);
    console.log("Sign up detail :", data);
    dispatch(signupSuccess({ user: data }));
  } catch (err) {
    dispatch(signupFailure(err.response?.data?.message || "Signup failed"));
  }
};



export { loginUser, signupUser , checkAuthUser};
