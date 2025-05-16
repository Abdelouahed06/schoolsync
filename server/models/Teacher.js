const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  profilePic: { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  timelinePath: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);