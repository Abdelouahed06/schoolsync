import {
  GET_STUDENT_PROFILE_SUCCESS,
  GET_STUDENT_PROFILE_FAIL,
  UPDATE_STUDENT_PROFILE_SUCCESS,
  UPDATE_STUDENT_PROFILE_FAIL,
  GET_STUDENT_COURSES_SUCCESS,
  GET_STUDENT_COURSES_FAIL,
  GET_COURSE_DETAILS_SUCCESS,
  GET_COURSE_DETAILS_FAIL,
  GET_AVAILABLE_QUIZZES_SUCCESS,
  GET_AVAILABLE_QUIZZES_FAIL,
  GET_ANSWERED_QUIZZES_SUCCESS,
  GET_ANSWERED_QUIZZES_FAIL,
  SUBMIT_QUIZ_SUCCESS,
  SUBMIT_QUIZ_FAIL,
} from '../actions/studentActions';

const initialState = {
  profile: null,
  courses: [],
  currentCourse: null,
  availableQuizzes: [],
  answeredQuizzes: [],
  error: null,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STUDENT_PROFILE_SUCCESS:
    case UPDATE_STUDENT_PROFILE_SUCCESS:
      return { ...state, profile: action.payload, error: null };
    case GET_STUDENT_PROFILE_FAIL:
    case UPDATE_STUDENT_PROFILE_FAIL:
      return { ...state, error: action.payload };
    case GET_STUDENT_COURSES_SUCCESS:
      return { ...state, courses: action.payload, error: null };
    case GET_STUDENT_COURSES_FAIL:
      return { ...state, error: action.payload };
    case GET_COURSE_DETAILS_SUCCESS:
      return { ...state, currentCourse: action.payload, error: null };
    case GET_COURSE_DETAILS_FAIL:
      return { ...state, error: action.payload };
    case GET_AVAILABLE_QUIZZES_SUCCESS:
      return { ...state, availableQuizzes: action.payload, error: null };
    case GET_AVAILABLE_QUIZZES_FAIL:
      return { ...state, error: action.payload };
    case GET_ANSWERED_QUIZZES_SUCCESS:
      return { ...state, answeredQuizzes: action.payload, error: null };
    case GET_ANSWERED_QUIZZES_FAIL:
      return { ...state, error: action.payload };
    case SUBMIT_QUIZ_SUCCESS:
      return {
        ...state,
        availableQuizzes: state.availableQuizzes.filter(
          (quiz) => quiz._id !== action.payload.quizId
        ),
        error: null,
      };
    case SUBMIT_QUIZ_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default studentReducer;