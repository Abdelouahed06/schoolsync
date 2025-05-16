import { combineReducers } from 'redux';
import authReducer from './authReducer';
import adminReducer from './adminReducer';
import teacherReducer from './teacherReducer';
import studentReducer from './studentReducer';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  teacher: teacherReducer,
  student: studentReducer,
  chat: chatReducer,
});

export default rootReducer;