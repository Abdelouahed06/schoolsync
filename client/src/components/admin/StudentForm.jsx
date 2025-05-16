import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomFileInput from '../common/CustomFileInput';


const StudentForm = ({ student, onSubmit, onClose }) => {
  const { classes } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    classId: '',
    file: null,
    password: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        username: student.username || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        classId: student.classId?._id || '',
        file: null,
        password: '',
      });
      setPreviewImage(student.profilePic ? `http://localhost:5000${student.profilePic}` : null);
      setFileName(student.profilePic ? student.profilePic.split('/').pop() : '');
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreviewImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (!student) {
      data.append('username', formData.username);
    }
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('classId', formData.classId);
    if (formData.file) {
      data.append('file', formData.file);
    }
    if (student && formData.password) {
      data.append('password', formData.password);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {!student && (
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 mb-2">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="classId" className="block text-gray-700 mb-2">
          Class
        </label>
        <select
          id="classId"
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      {student && (
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password (Leave blank to keep unchanged)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <div className="mb-4">
        <CustomFileInput
          id="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          fileName={fileName}
          label="Profile Picture"
        />
        {previewImage && (
          <div className="mt-2">
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {student ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;