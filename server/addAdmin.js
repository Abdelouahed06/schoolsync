const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const addAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return process.exit(0);
    }

    const password = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      username: 'admin',
      password,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      profilePic: 'admin1.jpg',
    });

    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

addAdmin();