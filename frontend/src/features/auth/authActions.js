// store/authActions.js
import axios from 'axios';
import {
  loginStart, loginSuccess, loginFailure,
  signupStart, signupSuccess, signupFailure,
} from './authSlice';

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const { data } = await axios.post('/api/auth/login', credentials);
    dispatch(loginSuccess({ user: data.user, token: data.token }));
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
  }
};

export const signupUser = (userData) => async (dispatch) => {
  dispatch(signupStart());
  try {
    const { data } = await axios.post('/api/auth/signup', userData);
    dispatch(signupSuccess({ user: data.user, token: data.token }));
  } catch (err) {
    dispatch(signupFailure(err.response?.data?.message || 'Signup failed'));
  }
};