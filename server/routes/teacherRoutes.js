const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

// All routes require teacher authentication
router.use(auth, (req, res, next) => {
  if (req.user.type !== 'Teacher') return res.status(403).json({ message: 'Unauthorized: Only teachers can access this route' });
  next();
});

// Profile routes
router.get('/profile', teacherController.getProfile);
router.put('/profile', teacherController.upload, teacherController.updateProfile);

// Class routes
router.get('/classes', teacherController.getClasses);
router.get('/classes/:classId/students', teacherController.getStudents);

// Course routes
router.get('/courses', teacherController.getCourses);
router.get('/courses/:courseId', teacherController.getCourse);
router.post('/courses', teacherController.upload, teacherController.addCourse);
router.put('/courses/:courseId', teacherController.upload, teacherController.updateCourse);
router.delete('/courses/:courseId', teacherController.deleteCourse);

// Quiz routes
router.get('/quizzes', teacherController.getQuizzes);
router.get('/quizzes/:quizId', teacherController.getQuiz);
router.post('/quizzes', teacherController.addQuiz);
router.put('/quizzes/:quizId', teacherController.updateQuiz);
router.delete('/quizzes/:quizId', teacherController.deleteQuiz);
router.put('/quizzes/:quizId/submissions/:submissionId/grade', teacherController.setQuizSubmissionGrade);

module.exports = router;