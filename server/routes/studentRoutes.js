const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

// All routes require student authentication
router.use(auth, (req, res, next) => {
  if (req.user.type !== 'Student') return res.status(403).json({ message: 'Unauthorized: Only students can access this route' });
  next();
});

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.upload, studentController.updateProfile);
router.get('/courses', studentController.getCourses);
router.get('/courses/:courseId', studentController.getCourseDetails);
router.get('/quizzes', studentController.getQuizzes);
router.get('/quizzes/answered', studentController.getAnsweredQuizzes);
router.post('/quizzes/:quizId/submit', studentController.upload, studentController.submitQuiz);

module.exports = router;