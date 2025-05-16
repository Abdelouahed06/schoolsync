const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }],
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['qcm', 'direct_answer', 'file_upload'], required: true },
  isPublished: { type: Boolean, default: false },
  questions: [{
    type: { type: String, enum: ['qcm', 'direct_answer', 'file_upload'], required: true },
    question: { type: String, required: true },
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          if (this.type === 'qcm') return v.length === 4;
          return v.length === 0;
        },
        message: 'QCM questions must have exactly 4 options; other types must have none.',
      },
    },
    correctAnswer: {
      type: String,
      required: function() {
        return ['qcm', 'direct_answer'].includes(this.type);
      },
    },
  }],
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    answers: [{
      questionIndex: { type: Number, required: true },
      answer: { type: String, required: true },
    }],
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'graded'], default: 'pending' },
    grade: { type: Number },
  }],
}, { timestamps: true });

quizSchema.index({ teacherId: 1 });
quizSchema.index({ classIds: 1 });
quizSchema.index({ subject: 1 });

module.exports = mongoose.model('Quiz', quizSchema);