const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All routes require admin authentication
router.use(auth, (req, res, next) => {
  if (req.user.type !== 'Admin') return res.status(403).json({ message: 'Unauthorized' });
  next();
});

router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.upload.single('profilePic'), adminController.updateProfile);
router.get('/dashboard', adminController.getDashboard);

router.post('/teachers', adminController.uploadFields, adminController.addTeacher);
router.put('/teachers/:id', adminController.uploadFields, adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);
router.get('/teachers/search', adminController.searchTeachers);
router.get('/teachers', adminController.getAllTeachers);

router.post('/students', adminController.singleUpload, adminController.addStudent);
router.put('/students/:id', adminController.singleUpload, adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);
router.get('/students/search', adminController.searchStudents);
router.get('/students', adminController.getAllStudents);

router.post('/classes', adminController.singleUpload, adminController.addClass);
router.put('/classes/:id', adminController.singleUpload, adminController.updateClass);
router.delete('/classes/:id', adminController.deleteClass);
router.get('/classes', adminController.getClasses);

router.post('/subjects', adminController.addSubject);
router.put('/subjects/:id', adminController.updateSubject);
router.delete('/subjects/:id', adminController.deleteSubject);
router.get('/subjects', adminController.getSubjects);

module.exports = router;