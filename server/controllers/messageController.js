const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Message = require('../models/Message');
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

const getFileType = (mimetype) => {
  if (mimetype.startsWith('text')) return 'text';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('video')) return 'video';
  if (mimetype.startsWith('audio')) return 'voice';
  return 'other';
};

// Get contacts
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;
    let contacts = [];

    if (userType === 'Student') {
      const student = await Student.findById(userId);
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const studentClass = await Class.findById(student.classId).populate('teacherIds', 'firstName lastName profilePic');
      if (!studentClass) return res.status(404).json({ message: 'Class not found' });

      contacts = studentClass.teacherIds.map(teacher => ({
        _id: teacher._id,
        type: 'Teacher',
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        profilePic: teacher.profilePic || null
      }));
    } else if (userType === 'Teacher') {
      const teacher = await Teacher.findById(userId);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

      const classes = await Class.find({ teacherIds: userId });
      const classIds = classes.map(cls => cls._id);

      const students = await Student.find({ classId: { $in: classIds } }).select('firstName lastName profilePic');
      contacts = students.map(student => ({
        _id: student._id,
        type: 'Student',
        firstName: student.firstName,
        lastName: student.lastName,
        profilePic: student.profilePic || null
      }));
    }

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching contacts', error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiverId, receiverType, content } = req.body;
  try {
    const senderId = req.user.id;
    const senderType = req.user.type;

    if (!['Teacher', 'Student'].includes(receiverType)) {
      return res.status(400).json({ message: 'Invalid receiver type' });
    }

    let isValidContact = false;
    if (senderType === 'Student') {
      const student = await Student.findById(senderId);
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const studentClass = await Class.findById(student.classId);
      if (!studentClass) return res.status(404).json({ message: 'Class not found' });

      const teacherIds = studentClass.teacherIds.map(id => id.toString());
      isValidContact = receiverType === 'Teacher' && teacherIds.includes(receiverId);
    } else if (senderType === 'Teacher') {
      const teacher = await Teacher.findById(senderId);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

      const classes = await Class.find({ teacherIds: senderId });
      const classIds = classes.map(cls => cls._id);
      const students = await Student.find({ classId: { $in: classIds } });
      const studentIds = students.map(student => student._id.toString());
      isValidContact = receiverType === 'Student' && studentIds.includes(receiverId);
    }

    if (!isValidContact) {
      return res.status(403).json({ message: 'You can only chat with authorized contacts' });
    }

    const sortedIds = [senderId, receiverId].sort();
    const conversationId = new mongoose.Types.ObjectId();

    let attachment = null;
    if (req.file) {
      attachment = {
        type: getFileType(req.file.mimetype),
        path: `/uploads/${req.file.filename}`,
        name: req.file.originalname,
      };
    }

    if (!content && !attachment) {
      return res.status(400).json({ message: 'Message content or attachment is required' });
    }

    const message = new Message({
      senderId,
      senderType,
      receiverId,
      receiverType,
      content: content || '',
      attachment,
      conversationId,
      sentAt: new Date(),
      read: false,
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error sending message', error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  const { contactId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    const contactType = userType === 'Student' ? 'Teacher' : 'Student';

    let isValidContact = false;
    if (userType === 'Student') {
      const student = await Student.findById(userId);
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const studentClass = await Class.findById(student.classId);
      if (!studentClass) return res.status(404).json({ message: 'Class not found' });

      const teacherIds = studentClass.teacherIds.map(id => id.toString());
      isValidContact = teacherIds.includes(contactId);
    } else if (userType === 'Teacher') {
      const teacher = await Teacher.findById(userId);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

      const classes = await Class.find({ teacherIds: userId });
      const classIds = classes.map(cls => cls._id);
      const students = await Student.find({ classId: { $in: classIds } });
      const studentIds = students.map(student => student._id.toString());
      isValidContact = studentIds.includes(contactId);
    }

    if (!isValidContact) {
      return res.status(403).json({ message: 'You can only view conversations with authorized contacts' });
    }

    await Message.updateMany(
      {
        senderId: contactId,
        receiverId: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    })
      .populate('senderId', 'firstName lastName')
      .populate('receiverId', 'firstName lastName')
      .sort({ sentAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching conversation', error: error.message });
  }
};