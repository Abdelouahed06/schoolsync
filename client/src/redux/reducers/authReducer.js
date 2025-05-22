import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/authActions';

const initialState = {
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};


const authReducer = (state = initialState, action) => {
  console.log('authReducer Action:', action);
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userType', action.payload.userType);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        userType: action.payload.userType,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_FAIL:
      console.log('LOGIN_FAIL Payload:', action.payload);
      return {
        ...state,
        token: null,
        userType: null,
        isAuthenticated: false,
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      return {
        ...state,
        token: null,
        userType: null,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;