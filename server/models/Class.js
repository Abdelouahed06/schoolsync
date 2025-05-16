const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }],
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  }],
  timelinePath: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);