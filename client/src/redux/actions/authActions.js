import api from '../../utils/api';
import { toast } from 'react-toastify';

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

// Login Action
export const login = (username, password) => async (dispatch) => {
  try {
    console.log('Attempting login with:', { username, password });
    const res = await api.post('/auth/login', { username, password });
    console.log('Login API Response:', res.data);
    const userType = res.data.userType.toLowerCase();
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: res.data.token,
        userType: userType,
      },
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userType', userType);
    toast.success('Login successful!');

    setTimeout(() => {
      if (userType === 'admin') {
        window.location.replace('/admin/dashboard');
      } else if (userType === 'teacher') {
        window.location.replace('/teacher/profile');
      } else if (userType === 'student') {
        window.location.replace('/student/profile');
      }
    }, 100);
  } catch (error) {
    console.log('Login API Error:', error.response?.data);
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || 'Login failed',
    });
    toast.error(error.response?.data?.message || 'Login failed');
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  dispatch({ type: LOGOUT });
  toast.success('Logged out successfully!');
  window.location.replace('/login');
};