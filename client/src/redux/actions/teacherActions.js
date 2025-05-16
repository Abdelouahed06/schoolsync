import api from '../../utils/api';
import { toast } from 'react-toastify';

// Action Types
export const GET_TEACHER_PROFILE_SUCCESS = 'GET_TEACHER_PROFILE_SUCCESS';
export const GET_TEACHER_PROFILE_FAIL = 'GET_TEACHER_PROFILE_FAIL';
export const UPDATE_TEACHER_PROFILE_SUCCESS = 'UPDATE_TEACHER_PROFILE_SUCCESS';
export const UPDATE_TEACHER_PROFILE_FAIL = 'UPDATE_TEACHER_PROFILE_FAIL';
export const GET_TEACHER_CLASSES_SUCCESS = 'GET_TEACHER_CLASSES_SUCCESS';
export const GET_TEACHER_CLASSES_FAIL = 'GET_TEACHER_CLASSES_FAIL';
export const GET_CLASS_STUDENTS_SUCCESS = 'GET_CLASS_STUDENTS_SUCCESS';
export const GET_CLASS_STUDENTS_FAIL = 'GET_CLASS_STUDENTS_FAIL';
export const GET_COURSES_SUCCESS = 'GET_COURSES_SUCCESS';
export const GET_COURSES_FAIL = 'GET_COURSES_FAIL';
export const GET_COURSE_SUCCESS = 'GET_COURSE_SUCCESS';
export const GET_COURSE_FAIL = 'GET_COURSE_FAIL';
export const ADD_COURSE_SUCCESS = 'ADD_COURSE_SUCCESS';
export const ADD_COURSE_FAIL = 'ADD_COURSE_FAIL';
export const UPDATE_COURSE_SUCCESS = 'UPDATE_COURSE_SUCCESS';
export const UPDATE_COURSE_FAIL = 'UPDATE_COURSE_FAIL';
export const DELETE_COURSE_SUCCESS = 'DELETE_COURSE_SUCCESS';
export const DELETE_COURSE_FAIL = 'DELETE_COURSE_FAIL';
export const GET_QUIZZES_SUCCESS = 'GET_QUIZZES_SUCCESS';
export const GET_QUIZZES_FAIL = 'GET_QUIZZES_FAIL';
export const GET_QUIZ_SUCCESS = 'GET_QUIZ_SUCCESS';
export const GET_QUIZ_FAIL = 'GET_QUIZ_FAIL';
export const ADD_QUIZ_SUCCESS = 'ADD_QUIZ_SUCCESS';
export const ADD_QUIZ_FAIL = 'ADD_QUIZ_FAIL';
export const UPDATE_QUIZ_SUCCESS = 'UPDATE_QUIZ_SUCCESS';
export const UPDATE_QUIZ_FAIL = 'UPDATE_QUIZ_FAIL';
export const DELETE_QUIZ_SUCCESS = 'DELETE_QUIZ_SUCCESS';
export const DELETE_QUIZ_FAIL = 'DELETE_QUIZ_FAIL';
export const GRADE_SUBMISSION_SUCCESS = 'GRADE_SUBMISSION_SUCCESS';
export const GRADE_SUBMISSION_FAIL = 'GRADE_SUBMISSION_FAIL';
export const CLEAR_CURRENT_QUIZ = 'CLEAR_CURRENT_QUIZ'; // New action type

// Get Teacher Profile
export const getTeacherProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/teacher/profile');
    dispatch({ type: GET_TEACHER_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_TEACHER_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch profile',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update Teacher Profile
export const updateTeacherProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/teacher/profile', formData);
    dispatch({ type: UPDATE_TEACHER_PROFILE_SUCCESS, payload: res.data });
    toast.success('Profile updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_TEACHER_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to update profile',
    });
    toast.error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Get Teacher Classes
export const getTeacherClasses = (name = '') => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/classes${name ? `?name=${name}` : ''}`);
    dispatch({ type: GET_TEACHER_CLASSES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_TEACHER_CLASSES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch classes',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch classes');
  }
};

// Get Students in a Class
export const getClassStudents = (classId) => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/classes/${classId}/students`);
    dispatch({ type: GET_CLASS_STUDENTS_SUCCESS, payload: { classId, students: res.data } });
  } catch (error) {
    dispatch({
      type: GET_CLASS_STUDENTS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch students',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch students');
  }
};

// Get Courses
export const getCourses = (classId = '') => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/courses${classId ? `?classId=${classId}` : ''}`);
    dispatch({ type: GET_COURSES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_COURSES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch courses',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

// Get Single Course
export const getCourse = (courseId) => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/courses/${courseId}`);
    dispatch({ type: GET_COURSE_SUCCESS, payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: GET_COURSE_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch course',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch course');
    throw error;
  }
};

// Add Course
export const addCourse = (courseData, files) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('subject', courseData.subject);
    formData.append('classIds', JSON.stringify(courseData.classIds));
    formData.append('name', courseData.name);
    formData.append('description', courseData.description);
    formData.append('modules', JSON.stringify(courseData.modules));

    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }

    const res = await api.post('/teacher/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: ADD_COURSE_SUCCESS, payload: res.data });
    toast.success('Course added successfully!');
    return res.data;
  } catch (error) {
    dispatch({
      type: ADD_COURSE_FAIL,
      payload: error.response?.data?.message || 'Failed to add course',
    });
    toast.error(error.response?.data?.message || 'Failed to add course');
    throw error;
  }
};

// Update Course
export const updateCourse = (courseId, courseData, files) => async (dispatch) => {
  try {
    const formData = new FormData();
    if (courseData.name) formData.append('name', courseData.name);
    if (courseData.description) formData.append('description', courseData.description);
    if (courseData.classIds) formData.append('classIds', JSON.stringify(courseData.classIds));
    if (courseData.modules) formData.append('modules', JSON.stringify(courseData.modules));

    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }

    const res = await api.put(`/teacher/courses/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: UPDATE_COURSE_SUCCESS, payload: res.data });
    toast.success('Course updated successfully!');
    return res.data;
  } catch (error) {
    dispatch({
      type: UPDATE_COURSE_FAIL,
      payload: error.response?.data?.message || 'Failed to update course',
    });
    toast.error(error.response?.data?.message || 'Failed to update course');
    throw error;
  }
};

// Delete Course
export const deleteCourse = (courseId) => async (dispatch) => {
  try {
    await api.delete(`/teacher/courses/${courseId}`);
    dispatch({ type: DELETE_COURSE_SUCCESS, payload: courseId });
    toast.success('Course deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_COURSE_FAIL,
      payload: error.response?.data?.message || 'Failed to delete course',
    });
    toast.error(error.response?.data?.message || 'Failed to delete course');
  }
};

// Get Quizzes
export const getQuizzes = (classId = '') => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/quizzes${classId ? `?classId=${classId}` : ''}`);
    dispatch({ type: GET_QUIZZES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_QUIZZES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch quizzes',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch quizzes');
  }
};

// Get Single Quiz
export const getQuiz = (quizId) => async (dispatch) => {
  try {
    const res = await api.get(`/teacher/quizzes/${quizId}`);
    dispatch({ type: GET_QUIZ_SUCCESS, payload: res.data });
    return res.data; // Return data for navigation
  } catch (error) {
    dispatch({
      type: GET_QUIZ_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch quiz',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch quiz');
    throw error;
  }
};

// Add Quiz
export const addQuiz = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/teacher/quizzes', formData);
    dispatch({ type: ADD_QUIZ_SUCCESS, payload: res.data });
    toast.success('Quiz added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_QUIZ_FAIL,
      payload: error.response?.data?.message || 'Failed to add quiz',
    });
    toast.error(error.response?.data?.message || 'Failed to add quiz');
  }
};

// Update Quiz
export const updateQuiz = (quizId, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/teacher/quizzes/${quizId}`, formData);
    dispatch({ type: UPDATE_QUIZ_SUCCESS, payload: res.data });
    toast.success('Quiz updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_QUIZ_FAIL,
      payload: error.response?.data?.message || 'Failed to update quiz',
    });
    toast.error(error.response?.data?.message || 'Failed to update quiz');
  }
};

// Delete Quiz
export const deleteQuiz = (quizId) => async (dispatch) => {
  try {
    await api.delete(`/teacher/quizzes/${quizId}`);
    dispatch({ type: DELETE_QUIZ_SUCCESS, payload: quizId });
    toast.success('Quiz deleted successfully!');
  } catch (error) {
    dispatch({
      type: DELETE_QUIZ_FAIL,
      payload: error.response?.data?.message || 'Failed to delete quiz',
    });
    toast.error(error.response?.data?.message || 'Failed to delete quiz');
  }
};

// Grade Submission
export const gradeSubmission = (quizId, submissionId, grade) => async (dispatch) => {
  try {
    const res = await api.put(`/teacher/quizzes/${quizId}/submissions/${submissionId}/grade`, { grade });
    dispatch({ type: GRADE_SUBMISSION_SUCCESS, payload: res.data.submission });
    toast.success('Submission graded successfully!');
  } catch (error) {
    dispatch({
      type: GRADE_SUBMISSION_FAIL,
      payload: error.response?.data?.message || 'Failed to grade submission',
    });
    toast.error(error.response?.data?.message || 'Failed to grade submission');
  }
};

// Clear Current Quiz
export const clearCurrentQuiz = () => (dispatch) => {
  dispatch({ type: CLEAR_CURRENT_QUIZ });
};