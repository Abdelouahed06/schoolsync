import {
  GET_TEACHER_PROFILE_SUCCESS,
  GET_TEACHER_PROFILE_FAIL,
  UPDATE_TEACHER_PROFILE_SUCCESS,
  UPDATE_TEACHER_PROFILE_FAIL,
  GET_TEACHER_CLASSES_SUCCESS,
  GET_TEACHER_CLASSES_FAIL,
  GET_CLASS_STUDENTS_SUCCESS,
  GET_CLASS_STUDENTS_FAIL,
  GET_COURSES_SUCCESS,
  GET_COURSES_FAIL,
  GET_COURSE_SUCCESS,
  GET_COURSE_FAIL,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAIL,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAIL,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAIL,
  GET_QUIZZES_SUCCESS,
  GET_QUIZZES_FAIL,
  GET_QUIZ_SUCCESS,
  GET_QUIZ_FAIL,
  ADD_QUIZ_SUCCESS,
  ADD_QUIZ_FAIL,
  UPDATE_QUIZ_SUCCESS,
  UPDATE_QUIZ_FAIL,
  DELETE_QUIZ_SUCCESS,
  DELETE_QUIZ_FAIL,
  GRADE_SUBMISSION_SUCCESS,
  GRADE_SUBMISSION_FAIL,
  CLEAR_CURRENT_QUIZ, // New action type
} from '../actions/teacherActions';

const initialState = {
  profile: null,
  classes: [],
  classStudents: {},
  courses: [],
  currentCourse: null,
  quizzes: [],
  currentQuiz: null,
  error: null,
};

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEACHER_PROFILE_SUCCESS:
    case UPDATE_TEACHER_PROFILE_SUCCESS:
      return { ...state, profile: action.payload, error: null };
    case GET_TEACHER_PROFILE_FAIL:
    case UPDATE_TEACHER_PROFILE_FAIL:
      return { ...state, error: action.payload };
    case GET_TEACHER_CLASSES_SUCCESS:
      return { ...state, classes: action.payload, error: null };
    case GET_TEACHER_CLASSES_FAIL:
      return { ...state, error: action.payload };
    case GET_CLASS_STUDENTS_SUCCESS:
      return {
        ...state,
        classStudents: {
          ...state.classStudents,
          [action.payload.classId]: action.payload.students,
        },
        error: null,
      };
    case GET_CLASS_STUDENTS_FAIL:
      return { ...state, error: action.payload };
    case GET_COURSES_SUCCESS:
      return { ...state, courses: action.payload, error: null };
    case GET_COURSES_FAIL:
      return { ...state, error: action.payload };
    case GET_COURSE_SUCCESS:
      return { ...state, currentCourse: action.payload, error: null };
    case GET_COURSE_FAIL:
      return { ...state, error: action.payload };
    case ADD_COURSE_SUCCESS:
      return { ...state, courses: [...state.courses, action.payload], error: null };
    case ADD_COURSE_FAIL:
      return { ...state, error: action.payload };
    case UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.map((course) =>
          course._id === action.payload._id ? action.payload : course
        ),
        currentCourse: action.payload,
        error: null,
      };
    case UPDATE_COURSE_FAIL:
      return { ...state, error: action.payload };
    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.filter((course) => course._id !== action.payload),
        currentCourse: null,
        error: null,
      };
    case DELETE_COURSE_FAIL:
      return { ...state, error: action.payload };
    case GET_QUIZZES_SUCCESS:
      return { ...state, quizzes: action.payload, error: null };
    case GET_QUIZZES_FAIL:
      return { ...state, error: action.payload };
    case GET_QUIZ_SUCCESS:
      return { ...state, currentQuiz: action.payload, error: null };
    case GET_QUIZ_FAIL:
      return { ...state, error: action.payload };
    case ADD_QUIZ_SUCCESS:
      return { ...state, quizzes: [...state.quizzes, action.payload], error: null };
    case ADD_QUIZ_FAIL:
      return { ...state, error: action.payload };
    case UPDATE_QUIZ_SUCCESS:
      return {
        ...state,
        quizzes: state.quizzes.map((quiz) =>
          quiz._id === action.payload._id ? action.payload : quiz
        ),
        currentQuiz: action.payload,
        error: null,
      };
    case UPDATE_QUIZ_FAIL:
      return { ...state, error: action.payload };
    case DELETE_QUIZ_SUCCESS:
      return {
        ...state,
        quizzes: state.quizzes.filter((quiz) => quiz._id !== action.payload),
        currentQuiz: null,
        error: null,
      };
    case DELETE_QUIZ_FAIL:
      return { ...state, error: action.payload };
    case GRADE_SUBMISSION_SUCCESS:
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          submissions: state.currentQuiz.submissions.map((sub) =>
            sub._id === action.payload._id ? action.payload : sub
          ),
        },
        error: null,
      };
    case GRADE_SUBMISSION_FAIL:
      return { ...state, error: action.payload };
    case CLEAR_CURRENT_QUIZ:
      return { ...state, currentQuiz: null, error: null };
    default:
      return state;
  }
};

export default teacherReducer;