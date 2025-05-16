import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/authActions';

const initialState = {
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const authReducer = (state = initialState, action) => {
  console.log('authReducer Action:', action);
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('LOGIN_SUCCESS Payload:', action.payload);
      return {
        ...state,
        token: action.payload.token,
        userType: action.payload.userType,
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
      console.log('LOGOUT');
      return {
        ...state,
        token: null,
        userType: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;