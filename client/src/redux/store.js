import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import adminReducer from './reducers/adminReducer';
import teacherReducer from './reducers/teacherReducer';
import studentReducer from './reducers/studentReducer';
import chatReducer from './reducers/chatReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    student: studentReducer,
    chat: chatReducer,
  },
});

export default store;