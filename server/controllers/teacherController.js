const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
exports.upload = upload.array('files');

// Get teacher profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id)
      .populate('subjects', 'name')
      .populate('classes', 'name');
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// Update teacher profile
exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email, phone, address, password } = req.body;
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (firstName) teacher.firstName = firstName;
    if (lastName) teacher.lastName = lastName;
    if (email) teacher.email = email;
    if (phone) teacher.phone = phone;
    if (address) teacher.address = address;
    if (password) teacher.password = await bcrypt.hash(password, 10);
    if (req.file) teacher.profilePic = `/uploads/${req.file.filename}`;

    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// Get classes with optional filtering by name
exports.getClasses = async (req, res) => {
  try {
    const { name } = req.query;
    let query = { teacherIds: req.user.id };
    if (name) {
      query.name = new RegExp(name, 'i');
    }
    const classes = await Class.find(query)
      .populate('studentIds', 'firstName lastName profilePic');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching classes', error: error.message });
  }
};

// Get students in a class
exports.getStudents = async (req, res) => {
  const { classId } = req.params;
  try {
    const classData = await Class.findById(classId);
    if (!classData || !classData.teacherIds.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized or class not found' });
    }
    const students = await Student.find({ _id: { $in: classData.studentIds } });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching students', error: error.message });
  }
};

// Get all courses with optional filtering by class
exports.getCourses = async (req, res) => {
  try {
    const { classId } = req.query;
    let query = { teacherId: req.user.id };
    if (classId) {
      query.classIds = classId;
    }
    const courses = await Course.find(query)
      .populate('subject', 'name')
      .populate('classIds', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses', error: error.message });
  }
};

// Get a single course by ID
exports.getCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId)
      .populate('subject', 'name')
      .populate('classIds', 'name');
    if (!course || course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course', error: error.message });
  }
};

// Add new course with modules, sections, and resources
exports.addCourse = async (req, res) => {
  const { subject, classIds, name, description, modules } = req.body;
  try {
    if (!subject || !classIds || !name) {
      return res.status(400).json({ message: 'Missing required fields: subject, classIds, or name' });
    }

    const teacher = await Teacher.findById(req.user.id);
    const subjectId = subject;

    const validSubject = await Subject.findById(subjectId);
    if (!validSubject) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }
    if (!teacher.subjects.includes(subjectId)) {
      return res.status(403).json({ message: 'Subject not assigned to this teacher' });
    }

    let classIdArray;
    try {
      classIdArray = JSON.parse(classIds);
      if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
      classIdArray.forEach(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid class ID: ${id}`);
        }
      });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array of valid ObjectIds', error: err.message });
    }

    const validClasses = await Class.find({ _id: { $in: classIdArray }, teacherIds: req.user.id });
    if (validClasses.length !== classIdArray.length) {
      return res.status(400).json({ message: 'One or more class IDs are invalid or not assigned to this teacher' });
    }

    let parsedModules = [];
    if (modules) {
      try {
        parsedModules = JSON.parse(modules);
        if (!Array.isArray(parsedModules)) throw new Error('Modules must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid modules format: must be a JSON array', error: err.message });
      }

      let fileIndex = 0;
      for (const module of parsedModules) {
        if (!module.name || !module.description) {
          return res.status(400).json({ message: 'Each module must have a name and description' });
        }
        for (const section of module.sections || []) {
          if (!section.name) {
            return res.status(400).json({ message: 'Each section must have a name' });
          }
          for (const resource of section.resources || []) {
            if (!resource.type || !resource.sourceType || !resource.name) {
              return res.status(400).json({ message: 'Each resource must have type, sourceType, and name' });
            }
            if (resource.sourceType === 'local') {
              if (!req.files || !req.files[fileIndex]) {
                return res.status(400).json({ message: 'Missing file for local resource' });
              }
              resource.path = `/uploads/${req.files[fileIndex].filename}`;
              fileIndex++;
            } else if (resource.sourceType === 'url') {
              if (!resource.path || !/^(https?:\/\/)/.test(resource.path)) {
                return res.status(400).json({ message: 'Invalid URL for resource' });
              }
            } else {
              return res.status(400).json({ message: 'Invalid sourceType: must be "local" or "url"' });
            }
          }
        }
      }
    }

    const course = new Course({
      teacherId: req.user.id,
      classIds: classIdArray,
      subject: subjectId,
      name,
      description,
      modules: parsedModules,
    });
    await course.save();

    await Class.updateMany(
      { _id: { $in: classIdArray } },
      { $addToSet: { enrolledCourses: course._id } }
    );

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding course', error: error.message });
  }
};

// Update course with modules, sections, and resources
exports.updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { classIds, name, description, modules } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course || course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or course not found' });
    }

    const originalClassIds = course.classIds.map(id => id.toString());

    if (name) course.name = name;
    if (description) course.description = description;

    if (classIds) {
      let classIdArray;
      try {
        classIdArray = JSON.parse(classIds);
        if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
        classIdArray.forEach(id => {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid class ID: ${id}`);
          }
        });
      } catch (err) {
        return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array of valid ObjectIds', error: err.message });
      }

      const validClasses = await Class.find({ _id: { $in: classIdArray }, teacherIds: req.user.id });
      if (validClasses.length !== classIdArray.length) {
        return res.status(400).json({ message: 'One or more class IDs are invalid or not assigned to this teacher' });
      }

      const newClassIds = classIdArray;
      const classesToRemove = originalClassIds.filter(id => !newClassIds.includes(id));
      await Class.updateMany(
        { _id: { $in: classesToRemove } },
        { $pull: { enrolledCourses: course._id } }
      );
      const classesToAdd = newClassIds.filter(id => !originalClassIds.includes(id));
      await Class.updateMany(
        { _id: { $in: classesToAdd } },
        { $addToSet: { enrolledCourses: course._id } }
      );

      course.classIds = classIdArray;
    }

    if (modules) {
      let parsedModules;
      try {
        parsedModules = JSON.parse(modules);
        if (!Array.isArray(parsedModules)) throw new Error('Modules must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid modules format: must be a JSON array', error: err.message });
      }

      let fileIndex = 0;
      for (const module of parsedModules) {
        if (!module.name || !module.description) {
          return res.status(400).json({ message: 'Each module must have a name and description' });
        }
        for (const section of module.sections || []) {
          if (!section.name) {
            return res.status(400).json({ message: 'Each section must have a name' });
          }
          for (const resource of section.resources || []) {
            if (!resource.type || !resource.sourceType || !resource.name) {
              return res.status(400).json({ message: 'Each resource must have type, sourceType, and name' });
            }
            if (resource.sourceType === 'local' && !resource._id) {
              if (!req.files || !req.files[fileIndex]) {
                return res.status(400).json({ message: 'Missing file for local resource' });
              }
              resource.path = `/uploads/${req.files[fileIndex].filename}`;
              fileIndex++;
            } else if (resource.sourceType === 'url' && !resource.path) {
              return res.status(400).json({ message: 'URL is required for URL-based resources' });
            }
          }
        }
      }

      course.modules = parsedModules; 
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course || course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or course not found' });
    }

    await Class.updateMany(
      { _id: { $in: course.classIds } },
      { $pull: { enrolledCourses: course._id } }
    );

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting course', error: error.message });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const { classId } = req.query;
    let query = { teacherId: req.user.id };
    if (classId) {
      query.classIds = classId;
    }
    const quizzes = await Quiz.find(query)
      .populate('subject', 'name')
      .populate('classIds', 'name')
      .populate({
        path: 'submissions.studentId',
        select: 'firstName lastName classId',
        populate: {
          path: 'classId',
          select: 'name',
        },
      });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching quizzes', error: error.message });
  }
};

// Get a single quiz by ID
exports.getQuiz = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId)
      .populate('subject', 'name')
      .populate('classIds', 'name')
      .populate({
        path: 'submissions.studentId',
        select: 'firstName lastName classId',
        populate: {
          path: 'classId',
          select: 'name',
        },
      });
    if (!quiz || quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching quiz', error: error.message });
  }
};

// Add new quiz
exports.addQuiz = async (req, res) => {
  const { subject, classIds, title, type, questions } = req.body;
  try {
    if (!subject || !classIds || !title || !type || !questions) {
      return res.status(400).json({ message: 'Missing required fields: subject, classIds, title, type, or questions' });
    }

    if (!['qcm', 'direct_answer', 'file_upload'].includes(type)) {
      return res.status(400).json({ message: 'Invalid quiz type: must be qcm, direct_answer, or file_upload' });
    }

    const teacher = await Teacher.findById(req.user.id);
    const subjectId = subject;
    const validSubject = await Subject.findById(subjectId);
    if (!validSubject) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }
    if (!teacher.subjects.includes(subjectId)) {
      return res.status(403).json({ message: 'Subject not assigned to this teacher' });
    }

    let classIdArray;
    try {
      classIdArray = JSON.parse(classIds);
      if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
      classIdArray.forEach(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid class ID: ${id}`);
        }
      });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array of valid ObjectIds', error: err.message });
    }

    const validClasses = await Class.find({ _id: { $in: classIdArray }, teacherIds: req.user.id });
    if (validClasses.length !== classIdArray.length) {
      return res.status(400).json({ message: 'One or more class IDs are invalid or not assigned to this teacher' });
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
      if (!Array.isArray(parsedQuestions)) throw new Error('Questions must be an array');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid questions format: must be a JSON array', error: err.message });
    }

    for (const question of parsedQuestions) {
      if (question.type !== type) {
        return res.status(400).json({ message: `All questions must be of type ${type}` });
      }
      if (type === 'qcm' && (!question.options || question.options.length !== 4 || !question.correctAnswer)) {
        return res.status(400).json({ message: 'QCM questions must have exactly 4 options and a correct answer' });
      }
      if (type === 'direct_answer' && !question.correctAnswer) {
        return res.status(400).json({ message: 'Direct answer questions must have a correct answer' });
      }
      if (type === 'file_upload' && (question.options || question.correctAnswer)) {
        return res.status(400).json({ message: 'File upload questions must not have options or a correct answer' });
      }
    }

    const quiz = new Quiz({
      teacherId: req.user.id,
      classIds: classIdArray,
      subject: subjectId,
      title,
      type,
      questions: parsedQuestions,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding quiz', error: error.message });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { subject, classIds, title, type, questions, isPublished } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or quiz not found' });
    }

    if (subject) {
      const teacher = await Teacher.findById(req.user.id);
      const subjectId = subject;
      const validSubject = await Subject.findById(subjectId);
      if (!validSubject) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      if (!teacher.subjects.includes(subjectId)) {
        return res.status(403).json({ message: 'Subject not assigned to this teacher' });
      }
      quiz.subject = subjectId;
    }

    if (classIds) {
      let classIdArray;
      try {
        classIdArray = JSON.parse(classIds);
        if (!Array.isArray(classIdArray)) throw new Error('Class IDs must be an array');
        classIdArray.forEach(id => {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid class ID: ${id}`);
          }
        });
      } catch (err) {
        return res.status(400).json({ message: 'Invalid classIds format: must be a JSON array of valid ObjectIds', error: err.message });
      }

      const validClasses = await Class.find({ _id: { $in: classIdArray }, teacherIds: req.user.id });
      if (validClasses.length !== classIdArray.length) {
        return res.status(400).json({ message: 'One or more class IDs are invalid or not assigned to this teacher' });
      }
      quiz.classIds = classIdArray;
    }

    if (title) quiz.title = title;
    if (type) {
      if (!['qcm', 'direct_answer', 'file_upload'].includes(type)) {
        return res.status(400).json({ message: 'Invalid quiz type: must be qcm, direct_answer, or file_upload' });
      }
      quiz.type = type;
    }
    if (questions) {
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(questions);
        if (!Array.isArray(parsedQuestions)) throw new Error('Questions must be an array');
      } catch (err) {
        return res.status(400).json({ message: 'Invalid questions format: must be a JSON array', error: err.message });
      }

      const quizType = type || quiz.type;
      for (const question of parsedQuestions) {
        if (question.type !== quizType) {
          return res.status(400).json({ message: `All questions must be of type ${quizType}` });
        }
        if (quizType === 'qcm' && (!question.options || question.options.length !== 4 || !question.correctAnswer)) {
          return res.status(400).json({ message: 'QCM questions must have exactly 4 options and a correct answer' });
        }
        if (quizType === 'direct_answer' && !question.correctAnswer) {
          return res.status(400).json({ message: 'Direct answer questions must have a correct answer' });
        }
        if (quizType === 'file_upload' && (question.options || question.correctAnswer)) {
          return res.status(400).json({ message: 'File upload questions must not have options or a correct answer' });
        }
      }
      quiz.questions = parsedQuestions;
    }
    if (typeof isPublished !== 'undefined') quiz.isPublished = isPublished;

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating quiz', error: error.message });
  }
};

// Set grade for a quiz submission
exports.setQuizSubmissionGrade = async (req, res) => {
  const { quizId, submissionId } = req.params;
  const { grade } = req.body;
  try {
    if (typeof grade !== 'number' || grade < 0) {
      return res.status(400).json({ message: 'Grade must be a non-negative number' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or quiz not found' });
    }

    const submission = quiz.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (quiz.type === 'qcm') {
      return res.status(400).json({ message: 'QCM quizzes are auto-graded and cannot be manually graded' });
    }

    submission.grade = grade;
    submission.status = 'graded';

    await quiz.save();
    res.json({ message: 'Grade set successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error setting grade', error: error.message });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or quiz not found' });
    }
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting quiz', error: error.message });
  }
};