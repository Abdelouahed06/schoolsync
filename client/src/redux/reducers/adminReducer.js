import {
    GET_ADMIN_PROFILE_SUCCESS,
    GET_ADMIN_PROFILE_FAIL,
    UPDATE_ADMIN_PROFILE_SUCCESS,
    UPDATE_ADMIN_PROFILE_FAIL,
    GET_DASHBOARD_SUCCESS,
    GET_DASHBOARD_FAIL,
    GET_TEACHERS_SUCCESS,
    GET_TEACHERS_FAIL,
    ADD_TEACHER_SUCCESS,
    ADD_TEACHER_FAIL,
    UPDATE_TEACHER_SUCCESS,
    UPDATE_TEACHER_FAIL,
    DELETE_TEACHER_SUCCESS,
    DELETE_TEACHER_FAIL,
    SEARCH_TEACHERS_SUCCESS,
    SEARCH_TEACHERS_FAIL,
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_FAIL,
    ADD_STUDENT_SUCCESS,
    ADD_STUDENT_FAIL,
    UPDATE_STUDENT_SUCCESS,
    UPDATE_STUDENT_FAIL,
    DELETE_STUDENT_SUCCESS,
    DELETE_STUDENT_FAIL,
    SEARCH_STUDENTS_SUCCESS,
    SEARCH_STUDENTS_FAIL,
    GET_CLASSES_SUCCESS,
    GET_CLASSES_FAIL,
    ADD_CLASS_SUCCESS,
    ADD_CLASS_FAIL,
    UPDATE_CLASS_SUCCESS,
    UPDATE_CLASS_FAIL,
    DELETE_CLASS_SUCCESS,
    DELETE_CLASS_FAIL,
    GET_SUBJECTS_SUCCESS,
    GET_SUBJECTS_FAIL,
    ADD_SUBJECT_SUCCESS,
    ADD_SUBJECT_FAIL,
    UPDATE_SUBJECT_SUCCESS,
    UPDATE_SUBJECT_FAIL,
    DELETE_SUBJECT_SUCCESS,
    DELETE_SUBJECT_FAIL,
  } from '../actions/adminActions';
  
  const initialState = {
    profile: null,
    dashboard: null,
    teachers: [],
    searchedTeachers: [],
    students: [],
    searchedStudents: [],
    classes: [],
    subjects: [],
    error: null,
  };
  
  const adminReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ADMIN_PROFILE_SUCCESS:
      case UPDATE_ADMIN_PROFILE_SUCCESS:
        return { ...state, profile: action.payload, error: null };
      case GET_ADMIN_PROFILE_FAIL:
      case UPDATE_ADMIN_PROFILE_FAIL:
        return { ...state, error: action.payload };
      case GET_DASHBOARD_SUCCESS:
        return { ...state, dashboard: action.payload, error: null };
      case GET_DASHBOARD_FAIL:
        return { ...state, error: action.payload };
      case GET_TEACHERS_SUCCESS:
        return { ...state, teachers: action.payload, error: null };
      case GET_TEACHERS_FAIL:
        return { ...state, error: action.payload };
      case ADD_TEACHER_SUCCESS:
        return { ...state, teachers: [...state.teachers, action.payload], error: null };
      case ADD_TEACHER_FAIL:
        return { ...state, error: action.payload };
      case UPDATE_TEACHER_SUCCESS:
        return {
          ...state,
          teachers: state.teachers.map((teacher) =>
            teacher._id === action.payload._id ? action.payload : teacher
          ),
          error: null,
        };
      case UPDATE_TEACHER_FAIL:
        return { ...state, error: action.payload };
      case DELETE_TEACHER_SUCCESS:
        return {
          ...state,
          teachers: state.teachers.filter((teacher) => teacher._id !== action.payload),
          error: null,
        };
      case DELETE_TEACHER_FAIL:
        return { ...state, error: action.payload };
      case SEARCH_TEACHERS_SUCCESS:
        return { ...state, searchedTeachers: action.payload, error: null };
      case SEARCH_TEACHERS_FAIL:
        return { ...state, error: action.payload };
      case GET_STUDENTS_SUCCESS:
        return { ...state, students: action.payload, error: null };
      case GET_STUDENTS_FAIL:
        return { ...state, error: action.payload };
      case ADD_STUDENT_SUCCESS:
        return { ...state, students: [...state.students, action.payload], error: null };
      case ADD_STUDENT_FAIL:
        return { ...state, error: action.payload };
      case UPDATE_STUDENT_SUCCESS:
        return {
          ...state,
          students: state.students.map((student) =>
            student._id === action.payload._id ? action.payload : student
          ),
          error: null,
        };
      case UPDATE_STUDENT_FAIL:
        return { ...state, error: action.payload };
      case DELETE_STUDENT_SUCCESS:
        return {
          ...state,
          students: state.students.filter((student) => student._id !== action.payload),
          error: null,
        };
      case DELETE_STUDENT_FAIL:
        return { ...state, error: action.payload };
      case SEARCH_STUDENTS_SUCCESS:
        return { ...state, searchedStudents: action.payload, error: null };
      case SEARCH_STUDENTS_FAIL:
        return { ...state, error: action.payload };
      case GET_CLASSES_SUCCESS:
        return { ...state, classes: action.payload, error: null };
      case GET_CLASSES_FAIL:
        return { ...state, error: action.payload };
      case ADD_CLASS_SUCCESS:
        return { ...state, classes: [...state.classes, action.payload], error: null };
      case ADD_CLASS_FAIL:
        return { ...state, error: action.payload };
      case UPDATE_CLASS_SUCCESS:
        return {
          ...state,
          classes: state.classes.map((cls) =>
            cls._id === action.payload._id ? action.payload : cls
          ),
          error: null,
        };
      case UPDATE_CLASS_FAIL:
        return { ...state, error: action.payload };
      case DELETE_CLASS_SUCCESS:
        return {
          ...state,
          classes: state.classes.filter((cls) => cls._id !== action.payload),
          error: null,
        };
      case DELETE_CLASS_FAIL:
        return { ...state, error: action.payload };
      case GET_SUBJECTS_SUCCESS:
        return { ...state, subjects: action.payload, error: null };
      case GET_SUBJECTS_FAIL:
        return { ...state, error: action.payload };
      case ADD_SUBJECT_SUCCESS:
        return { ...state, subjects: [...state.subjects, action.payload], error: null };
      case ADD_SUBJECT_FAIL:
        return { ...state, error: action.payload };
      case UPDATE_SUBJECT_SUCCESS:
        return {
          ...state,
          subjects: state.subjects.map((subject) =>
            subject._id === action.payload._id ? action.payload : subject
          ),
          error: null,
        };
      case UPDATE_SUBJECT_FAIL:
        return { ...state, error: action.payload };
      case DELETE_SUBJECT_SUCCESS:
        return {
          ...state,
          subjects: state.subjects.filter((subject) => subject._id !== action.payload),
          error: null,
        };
      case DELETE_SUBJECT_FAIL:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  export default adminReducer;