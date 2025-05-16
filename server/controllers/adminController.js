const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadFields = upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'timeline', maxCount: 1 },
]);

exports.upload = upload;

exports.singleUpload = upload.single('file');

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile', error: error.message });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      admin.email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      admin.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      admin.profilePic = `/uploads/${req.file.filename}`;
    }

    await admin.save();
    res.json(admin);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboard = async (req, res) => {
  try {
    const studentsCount = await Student.countDocuments();
    const teachersCount = await Teacher.countDocuments();
    const classesCount = await Class.countDocuments();
    const SubjectCount = await Subject.countDocuments();
    res.json({ studentsCount, teachersCount, classesCount, SubjectCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats', error: error.message });
  }
};

// Add new teacher
exports.addTeacher = async (req, res) => {
  const { username, firstName, lastName, email, phone, address, subjects, classIds } = req.body;
  try {
    if (!username || !firstName || !lastName || !email || !subjects) {
      return res.status(400).json({ message: 'Missing required fields: username, firstName, lastName, email, or subjects' });
    }

    const existingTeacher = await Teacher.findOne({ $or: [{ username }, { email }] });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const password = await bcrypt.hash('default123', 10);
    let subjectIds;
    try {
      subjectIds = JSON.parse(subjects);
      if (!Array.isArray(subjectIds)) throw new Error('Subjects must be an array');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid subjects format: must be a JSON array', error: err.message });
    }

    let classIdArray = [];
    if (classIds) {
      try {
        classIdArray = JSON.parse(classIds);
        if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array', error: err.message });
      }
    }

    const validSubjects = await Subject.find({ _id: { $in: subjectIds } });
    if (validSubjects.length !== subjectIds.length) {
      return res.status(400).json({ message: 'One or more subject IDs are invalid' });
    }

    if (classIdArray.length > 0) {
      const validClasses = await Class.find({ _id: { $in: classIdArray } });
      if (validClasses.length !== classIdArray.length) {
        return res.status(400).json({ message: 'One or more class IDs are invalid' });
      }
    }

    const teacher = new Teacher({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      subjects: subjectIds,
      classes: classIdArray,
      profilePic: req.files?.profilePic ? `/uploads/${req.files.profilePic[0].filename}` : null,
      timelinePath: req.files?.timeline ? `/uploads/${req.files.timeline[0].filename}` : null,
    });
    await teacher.save();

    if (classIdArray.length > 0) {
      await Class.updateMany(
        { _id: { $in: classIdArray } },
        { $addToSet: { teacherIds: teacher._id } } 
      );
    }

    res.status(201).json(teacher);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error adding teacher', error: error.message });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address, subjects, classIds } = req.body;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (email && email !== teacher.email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      const emailExists = await Teacher.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      teacher.email = email;
    }
    if (firstName) teacher.firstName = firstName;
    if (lastName) teacher.lastName = lastName;
    if (phone) teacher.phone = phone;
    if (address) teacher.address = address;

    if (subjects) {
      let subjectIds;
      try {
        subjectIds = JSON.parse(subjects);
        if (!Array.isArray(subjectIds)) throw new Error('Subjects must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid subjects format: must be a JSON array', error: err.message });
      }
      const validSubjects = await Subject.find({ _id: { $in: subjectIds } });
      if (validSubjects.length !== subjectIds.length) {
        return res.status(400).json({ message: 'One or more subject IDs are invalid' });
      }
      teacher.subjects = subjectIds;
    }

    if (classIds) {
      let classIdArray;
      try {
        classIdArray = JSON.parse(classIds);
        if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array', error: err.message });
      }
      const validClasses = await Class.find({ _id: { $in: classIdArray } });
      if (validClasses.length !== classIdArray.length) {
        return res.status(400).json({ message: 'One or more class IDs are invalid' });
      }

      await Class.updateMany(
        { teacherIds: teacher._id, _id: { $nin: classIdArray } },
        { $pull: { teacherIds: teacher._id } }
      );
      await Class.updateMany(
        { _id: { $in: classIdArray } },
        { $addToSet: { teacherIds: teacher._id } }
      );

      teacher.classes = classIdArray;
    }

    if (req.files?.profilePic) teacher.profilePic = `/uploads/${req.files.profilePic[0].filename}`;
    if (req.files?.timeline) teacher.timelinePath = `/uploads/${req.files.timeline[0].filename}`;

    await teacher.save();
    res.json(teacher);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error updating teacher', error: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }
    res.status(500).json({ message: 'Server error deleting teacher', error: error.message });
  }
};

// Search teachers
exports.searchTeachers = async (req, res) => {
  const { name, subject } = req.query;
  try {
    let query = {};
    if (name) query = { $or: [{ firstName: new RegExp(name, 'i') }, { lastName: new RegExp(name, 'i') }] };
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ message: 'Invalid subject ID format' });
      }
      query.subjects = subject;
    }

    const teachers = await Teacher.find(query).populate('subjects', 'name').populate('classes', 'name');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error searching teachers', error: error.message });
  }
};

// Get all teachers 
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('subjects', 'name').populate('classes', 'name');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all teachers', error: error.message });
  }
};

// Add new student 
exports.addStudent = async (req, res) => {
  const { username, firstName, lastName, email, phone, address, classId } = req.body;
  try {
    if (!username || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields: username, firstName, lastName, or email' });
    }

    const existingStudent = await Student.findOne({ $or: [{ username }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (classId) {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: 'Invalid class ID format' });
      }
      const validClass = await Class.findById(classId);
      if (!validClass) {
        return res.status(400).json({ message: 'Class not found' });
      }
    }

    const password = await bcrypt.hash('default123', 10);

    const student = new Student({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      classId: classId || null,
      profilePic: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await student.save();

    if (classId) {
      await Class.updateOne(
        { _id: classId },
        { $addToSet: { studentIds: student._id } }
      );
    }

    res.status(201).json(student);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error adding student', error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address, classId } = req.body;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (email && email !== student.email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      const emailExists = await Student.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      student.email = email;
    }
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (phone) student.phone = phone;
    if (address) student.address = address;

    if (classId && classId !== student.classId?.toString()) {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: 'Invalid class ID format' });
      }
      const validClass = await Class.findById(classId);
      if (!validClass) {
        return res.status(400).json({ message: 'Class not found' });
      }

      if (student.classId) {
        await Class.updateOne(
          { _id: student.classId },
          { $pull: { studentIds: student._id } }
        );
      }

      await Class.updateOne(
        { _id: classId },
        { $addToSet: { studentIds: student._id } }
      );

      student.classId = classId;
    }

    if (req.file) student.profilePic = `/uploads/${req.file.filename}`;

    await student.save();
    res.json(student);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error updating student', error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.classId) {
      await Class.updateOne(
        { _id: student.classId },
        { $pull: { studentIds: student._id } }
      );
    }

    await student.deleteOne(); 
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }
    res.status(500).json({ message: 'Server error deleting student', error: error.message });
  }
};

// Search students
exports.searchStudents = async (req, res) => {
  const { name, classId } = req.query;
  try {
    let query = {};
    if (name) query = { $or: [{ firstName: new RegExp(name, 'i') }, { lastName: new RegExp(name, 'i') }] };
    if (classId) {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: 'Invalid class ID format' });
      }
      query.classId = classId;
    }

    const students = await Student.find(query).populate('classId', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error searching students', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('classId', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all students', error: error.message });
  }
};

// Add new class
exports.addClass = async (req, res) => {
  const { name, teacherIds, studentIds } = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Class name is required' });

    let teacherIdArray, studentIdArray;
    try {
      teacherIdArray = JSON.parse(teacherIds);
      if (!Array.isArray(teacherIdArray)) throw new Error('Teacher IDs must be an array');
      studentIdArray = studentIds ? JSON.parse(studentIds) : [];
      if (!Array.isArray(studentIdArray)) throw new Error('Student IDs must be an array');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid teacherIds or studentIds format: must be a JSON array', error: err.message });
    }

    const validTeachers = await Teacher.find({ _id: { $in: teacherIdArray } });
    if (validTeachers.length !== teacherIdArray.length) {
      return res.status(400).json({ message: 'One or more teacher IDs are invalid' });
    }

    const validStudents = await Student.find({ _id: { $in: studentIdArray } });
    if (validStudents.length !== studentIdArray.length) {
      return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }

    const classData = new Class({
      name,
      teacherIds: teacherIdArray,
      studentIds: studentIdArray,
      timelinePath: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await classData.save();

    if (studentIdArray.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIdArray } },
        { $set: { classId: classData._id } }
      );
    }

    res.status(201).json(classData);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error adding class', error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, teacherIds, studentIds } = req.body;
  try {
    const classData = await Class.findById(id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    if (name) classData.name = name;

    if (teacherIds) {
      let teacherIdArray;
      try {
        teacherIdArray = JSON.parse(teacherIds);
        if (!Array.isArray(teacherIdArray)) throw new Error('Teacher IDs must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid teacherIds format: must be a JSON array', error: err.message });
      }
      const validTeachers = await Teacher.find({ _id: { $in: teacherIdArray } });
      if (validTeachers.length !== teacherIdArray.length) {
        return res.status(400).json({ message: 'One or more teacher IDs are invalid' });
      }
      classData.teacherIds = teacherIdArray;
    }

    if (studentIds) {
      let studentIdArray;
      try {
        studentIdArray = JSON.parse(studentIds);
        if (!Array.isArray(studentIdArray)) throw new Error('Student IDs must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid studentIds format: must be a JSON array', error: err.message });
      }
      const validStudents = await Student.find({ _id: { $in: studentIdArray } });
      if (validStudents.length !== studentIdArray.length) {
        return res.status(400).json({ message: 'One or more student IDs are invalid' });
      }

      const removedStudents = classData.studentIds.filter(id => !studentIdArray.includes(id.toString()));
      if (removedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: removedStudents } },
          { $set: { classId: null } }
        );
      }

      const addedStudents = studentIdArray.filter(id => !classData.studentIds.includes(id));
      if (addedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: addedStudents } },
          { $set: { classId: classData._id } }
        );
      }

      classData.studentIds = studentIdArray;
    }

    if (req.file) classData.timelinePath = `/uploads/${req.file.filename}`;

    await classData.save();
    res.json(classData);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: error.message });
    }
    res.status(500).json({ message: 'Server error updating class', error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    const classData = await Class.findById(id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    if (classData.studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: classData.studentIds } },
        { $set: { classId: null } }
      );
    }

    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }
    res.status(500).json({ message: 'Server error deleting class', error: error.message });
  }
};

// Add new subject
exports.addSubject = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Subject name is required' });

    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) return res.status(400).json({ message: 'Subject already exists' });

    const subject = new Subject({ name });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error adding subject', error: error.message });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (!name) return res.status(400).json({ message: 'Subject name is required' });
    if (name !== subject.name) {
      const existingSubject = await Subject.findOne({ name });
      if (existingSubject) return res.status(400).json({ message: 'Subject name already exists' });
    }

    subject.name = name;
    await subject.save();
    res.json(subject);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error updating subject', error: error.message });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }
    res.status(500).json({ message: 'Server error deleting subject', error: error.message });
  }
};

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching subjects', error: error.message });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching classes', error: error.message });
  }
};