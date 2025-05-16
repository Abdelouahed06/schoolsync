import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import CustomFileInput from '../common/CustomFileInput';

const TeacherForm = ({ teacher, onSubmit, onClose }) => {
  const { subjects, classes } = useSelector((state) => state.admin);

  useEffect(() => {
    console.log('Subjects in form:', subjects);
    console.log('Classes in form:', classes);
  }, [subjects, classes]);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    subjects: [],
    classIds: [],
    profilePic: null,
    timeline: null,
    password: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewTimeline, setPreviewTimeline] = useState(null);
  const [profilePicName, setProfilePicName] = useState('');
  const [timelineName, setTimelineName] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        username: teacher.username || '',
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        address: teacher.address || '',
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects.map((subject) => subject._id).filter(Boolean)
          : [],
        classIds: Array.isArray(teacher.classes)
          ? teacher.classes.map((cls) => cls._id).filter(Boolean)
          : [],
        profilePic: null,
        timeline: null,
        password: '',
      });
      setPreviewImage(teacher.profilePic ? `http://localhost:5000${teacher.profilePic}` : null);
      setPreviewTimeline(teacher.timelinePath ? `http://localhost:5000${teacher.timelinePath}` : null);
      setProfilePicName(teacher.profilePic ? teacher.profilePic.split('/').pop() : '');
      setTimelineName(teacher.timelinePath ? teacher.timelinePath.split('/').pop() : '');
    }
  }, [teacher]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData({ ...formData, [field]: values });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData({ ...formData, [name]: file });
      if (name === 'profilePic') {
        setPreviewImage(URL.createObjectURL(file));
        setProfilePicName(file.name);
      } else if (name === 'timeline') {
        setPreviewTimeline(URL.createObjectURL(file));
        setTimelineName(file.name);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    if (!teacher) {
      data.append('username', formData.username);
    }

    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);

    data.append('subjects', JSON.stringify(formData.subjects));
    data.append('classIds', JSON.stringify(formData.classIds));

    if (formData.profilePic) {
      data.append('profilePic', formData.profilePic);
    }
    if (formData.timeline) {
      data.append('timeline', formData.timeline);
    }
    if (teacher && formData.password) {
      data.append('password', formData.password);
    }

    onSubmit(data);
  };

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: subject.name,
  }));

  const classOptions = classes.map((cls) => ({
    value: cls._id,
    label: cls.name,
  }));

  const selectedSubjects = subjectOptions.filter((option) =>
    formData.subjects.includes(option.value)
  );

  const selectedClasses = classOptions.filter((option) =>
    formData.classIds.includes(option.value)
  );

  return (
    <form onSubmit={handleSubmit}>
      {!teacher && (
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
        <label htmlFor="subjects" className="block text-gray-700 mb-2">
          Subjects
        </label>
        <Select
          isMulti
          options={subjectOptions}
          value={selectedSubjects}
          onChange={(selected) => handleMultiSelectChange(selected, 'subjects')}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select subjects..."
          noOptionsMessage={() => 'No subjects available'}
          isDisabled={subjects.length === 0}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="classIds" className="block text-gray-700 mb-2">
          Classes
        </label>
        <Select
          isMulti
          options={classOptions}
          value={selectedClasses}
          onChange={(selected) => handleMultiSelectChange(selected, 'classIds')}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select classes..."
          noOptionsMessage={() => 'No classes available'}
          isDisabled={classes.length === 0}
        />
      </div>
      {teacher && (
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
          id="profilePic"
          name="profilePic"
          accept="image/*"
          onChange={handleFileChange}
          fileName={profilePicName}
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
      <div className="mb-4">
        <CustomFileInput
          id="timeline"
          name="timeline"
          accept="application/pdf"
          onChange={handleFileChange}
          fileName={timelineName}
          label="Timeline (PDF)"
        />
        {previewTimeline && (
          <div className="mt-2">
            <a
              href={previewTimeline}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Timeline Preview
            </a>
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
          {teacher ? 'Update' : 'Add'} Teacher
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;