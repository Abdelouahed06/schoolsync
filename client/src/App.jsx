import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminTeachers from './pages/admin/Teachers';
import AdminStudents from './pages/admin/Students';
import AdminClasses from './pages/admin/Classes';
import AdminSubjects from './pages/admin/Subjects';
import TeacherProfile from './pages/teacher/Profile';
import TeacherClasses from './pages/teacher/Classes';
import TeacherCourses from './pages/teacher/Courses';
import TeacherQuizzes from './pages/teacher/Quizzes';
import TeacherChat from './pages/teacher/Chat';
import TeacherCourseDetails from './pages/teacher/CourseDetails';
import TeacherQuizDetails from './pages/teacher/QuizDetails';
import StudentProfile from './pages/student/Profile';
import StudentCourses from './pages/student/Courses';
import StudentCourseDetails from './pages/student/CourseDetails';
import StudentQuizzes from './pages/student/Quizzes';
import StudentAnsweredQuizzes from './pages/student/AnsweredQuizzes';
import StudentChat from './pages/student/Chat';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  console.log('ProtectedRoute Check:', { isAuthenticated, userType, allowedRoles, path: window.location.pathname });

  if (!isAuthenticated) {
    console.log('Redirecting to /login: Not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    console.log('Redirecting to /login: Role not allowed');
    return <Navigate to="/login" replace />;
  }

  console.log('Rendering protected route:', children.type.name);
  return children;
};

const App = () => {
  console.log('App rendering, current path:', window.location.pathname);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTeachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSubjects />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quizzes"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quizzes/:quizId"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherQuizDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/chat"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses/:id"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherCourseDetails />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quizzes"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/answered-quizzes"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAnsweredQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentChat />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;