import api from '../../utils/api';
import { toast } from 'react-toastify';

// Action Types
export const GET_STUDENT_PROFILE_SUCCESS = 'GET_STUDENT_PROFILE_SUCCESS';
export const GET_STUDENT_PROFILE_FAIL = 'GET_STUDENT_PROFILE_FAIL';
export const UPDATE_STUDENT_PROFILE_SUCCESS = 'UPDATE_STUDENT_PROFILE_SUCCESS';
export const UPDATE_STUDENT_PROFILE_FAIL = 'UPDATE_STUDENT_PROFILE_FAIL';
export const GET_STUDENT_COURSES_SUCCESS = 'GET_STUDENT_COURSES_SUCCESS';
export const GET_STUDENT_COURSES_FAIL = 'GET_STUDENT_COURSES_FAIL';
export const GET_COURSE_DETAILS_SUCCESS = 'GET_COURSE_DETAILS_SUCCESS';
export const GET_COURSE_DETAILS_FAIL = 'GET_COURSE_DETAILS_FAIL';
export const GET_AVAILABLE_QUIZZES_SUCCESS = 'GET_AVAILABLE_QUIZZES_SUCCESS';
export const GET_AVAILABLE_QUIZZES_FAIL = 'GET_AVAILABLE_QUIZZES_FAIL';
export const GET_ANSWERED_QUIZZES_SUCCESS = 'GET_ANSWERED_QUIZZES_SUCCESS';
export const GET_ANSWERED_QUIZZES_FAIL = 'GET_ANSWERED_QUIZZES_FAIL';
export const SUBMIT_QUIZ_SUCCESS = 'SUBMIT_QUIZ_SUCCESS';
export const SUBMIT_QUIZ_FAIL = 'SUBMIT_QUIZ_FAIL';

// Get Student Profile
export const getStudentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/student/profile');
    dispatch({ type: GET_STUDENT_PROFILE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_STUDENT_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch profile',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update Student Profile
export const updateStudentProfile = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/student/profile', formData);
    dispatch({ type: UPDATE_STUDENT_PROFILE_SUCCESS, payload: res.data });
    toast.success('Profile updated successfully!');
  } catch (error) {
    dispatch({
      type: UPDATE_STUDENT_PROFILE_FAIL,
      payload: error.response?.data?.message || 'Failed to update profile',
    });
    toast.error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Get Student Courses
export const getStudentCourses = (subject = '') => async (dispatch) => {
  try {
    const res = await api.get(`/student/courses${subject ? `?subject=${subject}` : ''}`);
    dispatch({ type: GET_STUDENT_COURSES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_STUDENT_COURSES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch courses',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

// Get Course Details
export const getCourseDetails = (courseId) => async (dispatch) => {
  try {
    const res = await api.get(`/student/courses/${courseId}`);
    dispatch({ type: GET_COURSE_DETAILS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_COURSE_DETAILS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch course details',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch course details');
  }
};

// Get Available Quizzes
export const getAvailableQuizzes = (subject = '') => async (dispatch) => {
  try {
    const res = await api.get(`/student/quizzes${subject ? `?subject=${subject}` : ''}`);
    dispatch({ type: GET_AVAILABLE_QUIZZES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_AVAILABLE_QUIZZES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch quizzes',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch quizzes');
  }
};

// Get Answered Quizzes
export const getAnsweredQuizzes = (subject = '') => async (dispatch) => {
  try {
    const res = await api.get(`/student/quizzes/answered${subject ? `?subject=${subject}` : ''}`);
    dispatch({ type: GET_ANSWERED_QUIZZES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_ANSWERED_QUIZZES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch answered quizzes',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch answered quizzes');
  }
};

// Submit Quiz
export const submitQuiz = (quizId, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const res = await api.post(
      `/student/quizzes/${quizId}/submit`,
      formData,
      config
    );
    
    dispatch({ type: SUBMIT_QUIZ_SUCCESS, payload: res.data });
    toast.success('Quiz submitted successfully!');
    return res.data;
  } catch (error) {
    dispatch({
      type: SUBMIT_QUIZ_FAIL,
      payload: error.response?.data?.message || 'Failed to submit quiz',
    });
    toast.error(error.response?.data?.message || 'Failed to submit quiz');
    throw error;
  }
};