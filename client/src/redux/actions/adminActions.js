import api from '../../utils/api';
import { toast } from 'react-toastify';

// Action Types
export const GET_ADMIN_PROFILE_SUCCESS = 'GET_ADMIN_PROFILE_SUCCESS';
export const GET_ADMIN_PROFILE_FAIL = 'GET_ADMIN_PROFILE_FAIL';
export const UPDATE_ADMIN_PROFILE_SUCCESS = 'UPDATE_ADMIN_PROFILE_SUCCESS';
export const UPDATE_ADMIN_PROFILE_FAIL = 'UPDATE_ADMIN_PROFILE_FAIL';
export const GET_DASHBOARD_SUCCESS = 'GET_DASHBOARD_SUCCESS';
export const GET_DASHBOARD_FAIL = 'GET_DASHBOARD_FAIL';
export const GET_TEACHERS_SUCCESS = 'GET_TEACHERS_SUCCESS';
export const GET_TEACHERS_FAIL = 'GET_TEACHERS_FAIL';
export const ADD_TEACHER_SUCCESS = 'ADD_TEACHER_SUCCESS';
export const ADD_TEACHER_FAIL = 'ADD_TEACHER_FAIL';
export const UPDATE_TEACHER_SUCCESS = 'UPDATE_TEACHER_SUCCESS';
export const UPDATE_TEACHER_FAIL = 'UPDATE_TEACHER_FAIL';
export const DELETE_TEACHER_SUCCESS = 'DELETE_TEACHER_SUCCESS';
export const DELETE_TEACHER_FAIL = 'DELETE_TEACHER_FAIL';
export const SEARCH_TEACHERS_SUCCESS = 'SEARCH_TEACHERS_SUCCESS';
export const SEARCH_TEACHERS_FAIL = 'SEARCH_TEACHERS_FAIL';
export const GET_STUDENTS_SUCCESS = 'GET_STUDENTS_SUCCESS';
export const GET_STUDENTS_FAIL = 'GET_STUDENTS_FAIL';
export const ADD_STUDENT_SUCCESS = 'ADD_STUDENT_SUCCESS';
export const ADD_STUDENT_FAIL = 'ADD_STUDENT_FAIL';
export const UPDATE_STUDENT_SUCCESS = 'UPDATE_STUDENT_SUCCESS';
export const UPDATE_STUDENT_FAIL = 'UPDATE_STUDENT_FAIL';
export const DELETE_STUDENT_SUCCESS = 'DELETE_STUDENT_SUCCESS';
export const DELETE_STUDENT_FAIL = 'DELETE_STUDENT_FAIL';
export const SEARCH_STUDENTS_SUCCESS = 'SEARCH_STUDENTS_SUCCESS';
export const SEARCH_STUDENTS_FAIL = 'SEARCH_STUDENTS_FAIL';
export const GET_CLASSES_SUCCESS = 'GET_CLASSES_SUCCESS';
export const GET_CLASSES_FAIL = 'GET_CLASSES_FAIL';
export const ADD_CLASS_SUCCESS = 'ADD_CLASS_SUCCESS';
export const ADD_CLASS_FAIL = 'ADD_CLASS_FAIL';
export const UPDATE_CLASS_SUCCESS = 'UPDATE_CLASS_SUCCESS';
export const UPDATE_CLASS_FAIL = 'UPDATE_CLASS_FAIL';
export const DELETE_CLASS_SUCCESS = 'DELETE_CLASS_SUCCESS';
export const DELETE_CLASS_FAIL = 'DELETE_CLASS_FAIL';
export const GET_SUBJECTS_SUCCESS = 'GET_SUBJECTS_SUCCESS';
export const GET_SUBJECTS_FAIL = 'GET_SUBJECTS_FAIL';
export const ADD_SUBJECT_SUCCESS = 'ADD_SUBJECT_SUCCESS';
export const ADD_SUBJECT_FAIL = 'ADD_SUBJECT_FAIL';
export const UPDATE_SUBJECT_SUCCESS = 'UPDATE_SUBJECT_SUCCESS';
export const UPDATE_SUBJECT_FAIL = 'UPDATE_SUBJECT_FAIL';
export const DELETE_SUBJECT_SUCCESS = 'DELETE_SUBJECT_SUCCESS';
export const DELETE_SUBJECT_FAIL = 'DELETE_SUBJECT_FAIL';

// Get Admin Profile
export const getAdminProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/profile');
    dispatch({ type: GET_ADMIN_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch profile',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update Admin Profile
export const updateAdminProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/admin/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPDATE_ADMIN_PROFILE_SUCCESS, payload: res.data });
    toast.success('Profile updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_ADMIN_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to update profile',
    });
    toast.error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Get Dashboard Stats
export const getDashboardStats = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/dashboard');
    dispatch({ type: GET_DASHBOARD_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_DASHBOARD_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch dashboard stats',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch dashboard stats');
  }
};

// Get All Teachers
export const getTeachers = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/teachers');
    dispatch({ type: GET_TEACHERS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_TEACHERS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch teachers',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch teachers');
  }
};

// Add Teacher
export const addTeacher = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/admin/teachers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: ADD_TEACHER_SUCCESS, payload: res.data });
    toast.success('Teacher added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_TEACHER_FAIL,
      payload: error.response?.data?.message || 'Failed to add teacher',
    });
    toast.error(error.response?.data?.message || 'Failed to add teacher');
  }
};

// Update Teacher
export const updateTeacher = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/teachers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPDATE_TEACHER_SUCCESS, payload: res.data });
    toast.success('Teacher updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_TEACHER_FAIL,
      payload: error.response?.data?.message || 'Failed to update teacher',
    });
    toast.error(error.response?.data?.message || 'Failed to update teacher');
  }
};

// Delete Teacher
export const deleteTeacher = (id) => async (dispatch) => {
  try {
    await api.delete(`/admin/teachers/${id}`);
    dispatch({ type: DELETE_TEACHER_SUCCESS, payload: id });
    toast.success('Teacher deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_TEACHER_FAIL,
      payload: error.response?.data?.message || 'Failed to delete teacher',
    });
    toast.error(error.response?.data?.message || 'Failed to delete teacher');
  }
};

// Search Teachers
export const searchTeachers = (name, subject) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/teachers/search?name=${name}&subject=${subject}`);
    dispatch({ type: SEARCH_TEACHERS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: SEARCH_TEACHERS_FAIL,
      payload: error.response?.data?.message || 'Failed to search teachers',
    });
    toast.error(error.response?.data?.message || 'Failed to search teachers');
  }
};

// Get All Students
export const getStudents = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/students');
    dispatch({ type: GET_STUDENTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_STUDENTS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch students',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch students');
  }
};

// Add Student
export const addStudent = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/admin/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: ADD_STUDENT_SUCCESS, payload: res.data });
    toast.success('Student added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_STUDENT_FAIL,
      payload: error.response?.data?.message || 'Failed to add student',
    });
    toast.error(error.response?.data?.message || 'Failed to add student');
  }
};

// Update Student
export const updateStudent = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/students/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPDATE_STUDENT_SUCCESS, payload: res.data });
    toast.success('Student updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_STUDENT_FAIL,
      payload: error.response?.data?.message || 'Failed to update student',
    });
    toast.error(error.response?.data?.message || 'Failed to update student');
  }
};

// Delete Student
export const deleteStudent = (id) => async (dispatch) => {
  try {
    await api.delete(`/admin/students/${id}`);
    dispatch({ type: DELETE_STUDENT_SUCCESS, payload: id });
    toast.success('Student deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_STUDENT_FAIL,
      payload: error.response?.data?.message || 'Failed to delete student',
    });
    toast.error(error.response?.data?.message || 'Failed to delete student');
  }
};

// Search Students
export const searchStudents = (name, classId) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/students/search?name=${name}&classId=${classId}`);
    dispatch({ type: SEARCH_STUDENTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: SEARCH_STUDENTS_FAIL,
      payload: error.response?.data?.message || 'Failed to search students',
    });
    toast.error(error.response?.data?.message || 'Failed to search students');
  }
};

// Get All Classes
export const getClasses = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/classes');
    dispatch({ type: GET_CLASSES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_CLASSES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch classes',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch classes');
  }
};

// Add Class
export const addClass = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/admin/classes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: ADD_CLASS_SUCCESS, payload: res.data });
    toast.success('Class added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_CLASS_FAIL,
      payload: error.response?.data?.message || 'Failed to add class',
    });
    toast.error(error.response?.data?.message || 'Failed to add class');
  }
};

// Update Class
export const updateClass = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/classes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPDATE_CLASS_SUCCESS, payload: res.data });
    toast.success('Class updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_CLASS_FAIL,
      payload: error.response?.data?.message || 'Failed to update class',
    });
    toast.error(error.response?.data?.message || 'Failed to update class');
  }
};

// Delete Class
export const deleteClass = (id) => async (dispatch) => {
  try {
    await api.delete(`/admin/classes/${id}`);
    dispatch({ type: DELETE_CLASS_SUCCESS, payload: id });
    toast.success('Class deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_CLASS_FAIL,
      payload: error.response?.data?.message || 'Failed to delete class',
    });
    toast.error(error.response?.data?.message || 'Failed to delete class');
  }
};

// Get All Subjects
export const getSubjects = () => async (dispatch) => {
  try {
    const res = await api.get('/admin/subjects');
    dispatch({ type: GET_SUBJECTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_SUBJECTS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch subjects',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch subjects');
  }
};

// Add Subject
export const addSubject = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/admin/subjects', formData);
    dispatch({ type: ADD_SUBJECT_SUCCESS, payload: res.data });
    toast.success('Subject added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_SUBJECT_FAIL,
      payload: error.response?.data?.message || 'Failed to add subject',
    });
    toast.error(error.response?.data?.message || 'Failed to add subject');
  }
};

// Update Subject
export const updateSubject = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/subjects/${id}`, formData);
    dispatch({ type: UPDATE_SUBJECT_SUCCESS, payload: res.data });
    toast.success('Subject updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_SUBJECT_FAIL,
      payload: error.response?.data?.message || 'Failed to update subject',
    });
    toast.error(error.response?.data?.message || 'Failed to update subject');
  }
};

// Delete Subject
export const deleteSubject = (id) => async (dispatch) => {
  try {
    await api.delete(`/admin/subjects/${id}`);
    dispatch({ type: DELETE_SUBJECT_SUCCESS, payload: id });
    toast.success('Subject deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_SUBJECT_FAIL,
      payload: error.response?.data?.message || 'Failed to delete subject',
    });
    toast.error(error.response?.data?.message || 'Failed to delete subject');
  }
};