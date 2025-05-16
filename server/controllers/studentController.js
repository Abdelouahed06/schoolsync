const Student = require('../models/Student');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Class = require('../models/Class');
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
exports.upload = upload.single('file');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('classId', 'name timelinePath');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  const { email, phone, address, password } = req.body;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (email) {
      const existingStudent = await Student.findOne({ email, _id: { $ne: student._id } });
      if (existingStudent) return res.status(400).json({ message: 'Email already in use' });
      student.email = email;
    }
    if (phone) student.phone = phone;
    if (address) student.address = address;
    if (password) student.password = await bcrypt.hash(password, 10);
    if (req.file) student.profilePic = `/uploads/${req.file.filename}`;

    await student.save();
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// Get courses for student
exports.getCourses = async (req, res) => {
  const { subject } = req.query;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let query = { classIds: student.classId };
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      query.subject = subject;
    }

    const courses = await Course.find(query)
      .populate('teacherId', 'firstName lastName')
      .populate('subject', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses', error: error.message });
  }
};

// Get specific course details
exports.getCourseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findOne({ _id: courseId, classIds: student.classId })
      .populate('teacherId', 'firstName lastName')
      .populate('subject', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found or not accessible' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course details', error: error.message });
  }
};

// Get available quizzes (not answered by the student)
exports.getQuizzes = async (req, res) => {
  const { subject } = req.query;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let query = {
      classIds: student.classId,
      isPublished: true,
      'submissions.studentId': { $ne: req.user.id }, // Exclude submitted quizzes
    };
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      query.subject = subject;
    }

    const quizzes = await Quiz.find(query)
      .populate('teacherId', 'firstName lastName')
      .populate('subject', 'name')
      .populate('classIds', 'name'); // Add class name for better display
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching unanswered quizzes', error: error.message });
  }
};

// Get quizzes answered by the student
exports.getAnsweredQuizzes = async (req, res) => {
  const { subject } = req.query;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let query = {
      classIds: student.classId,
      isPublished: true,
      'submissions.studentId': req.user.id, // Only include quizzes the student has submitted
    };
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      query.subject = subject;
    }

    const quizzes = await Quiz.find(query)
      .populate('teacherId', 'firstName lastName')
      .populate('subject', 'name')
      .populate('classIds', 'name');

    // Filter submissions to only include the student's submission
    const filteredQuizzes = quizzes.map(quiz => {
      const studentSubmission = quiz.submissions.find(
        sub => sub.studentId.toString() === req.user.id
      );
      return {
        _id: quiz._id,
        teacherId: quiz.teacherId,
        classIds: quiz.classIds,
        subject: quiz.subject,
        title: quiz.title,
        type: quiz.type,
        isPublished: quiz.isPublished,
        questions: quiz.questions,
        submission: {
          status: studentSubmission.status,
          grade: studentSubmission.grade,
          submittedAt: studentSubmission.submittedAt,
        },
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
        __v: quiz.__v,
      };
    });

    res.json(filteredQuizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching answered quizzes', error: error.message });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const quiz = await Quiz.findOne({ _id: quizId, classIds: student.classId, isPublished: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found or not accessible' });

    // Check if student has already submitted (one chance per quiz)
    if (quiz.submissions.some(sub => sub.studentId.toString() === req.user.id)) {
      return res.status(400).json({ message: 'You have already submitted this quiz. Only one submission is allowed per quiz.' });
    }

    // Parse answers
    let parsedAnswers;
    try {
      parsedAnswers = JSON.parse(answers);
      if (!Array.isArray(parsedAnswers)) throw new Error('Answers must be an array');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid answers format: must be a JSON array', error: err.message });
    }

    // Validate answers
    if (parsedAnswers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Number of answers must match number of questions' });
    }

    const submission = {
      studentId: req.user.id,
      answers: [],
      status: 'pending', // Default status
    };

    let score = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const answer = parsedAnswers[i];

      if (!answer || typeof answer.questionIndex !== 'number' || !('answer' in answer)) {
        return res.status(400).json({ message: `Invalid answer format for question ${i}` });
      }

      if (answer.questionIndex !== i) {
        return res.status(400).json({ message: `Question index mismatch at position ${i}` });
      }

      if (quiz.type === 'file_upload') {
        if (!req.file) {
          return res.status(400).json({ message: `File upload required for question ${i}` });
        }
        submission.answers.push({
          questionIndex: i,
          answer: `/uploads/${req.file.filename}`,
        });
      } else {
        if (typeof answer.answer !== 'string') {
          return res.status(400).json({ message: `Answer for question ${i} must be a string` });
        }
        submission.answers.push({
          questionIndex: i,
          answer: answer.answer,
        });

        // Auto-grade for QCM only
        if (quiz.type === 'qcm') {
          if (answer.answer === question.correctAnswer) {
            score += 1; // 1 point per correct answer
          }
        }
      }
    }

    // Set grade and status based on quiz type
    if (quiz.type === 'qcm') {
      submission.status = 'graded';
      submission.grade = score; // Total number of correct answers
    } else {
      // For direct_answer and file_upload, grade will be set by the teacher later
      submission.status = 'pending';
      submission.grade = null;
    }

    quiz.submissions.push(submission);
    await quiz.save();
    res.json({ message: 'Quiz submitted successfully', grade: submission.grade });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting quiz', error: error.message });
  }
};