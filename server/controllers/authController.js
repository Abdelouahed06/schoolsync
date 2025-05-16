const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await Admin.findOne({ username });
    let userType = 'Admin';
    if (!user) {
      user = await Teacher.findOne({ username });
      userType = 'Teacher';
    }
    if (!user) {
      user = await Student.findOne({ username });
      userType = 'Student';
    }
    if (!user) return res.status(400).json({ message: 'Invalid username ' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, type: userType }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, userType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};