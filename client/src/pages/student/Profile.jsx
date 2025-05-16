import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStudentProfile, updateStudentProfile } from '../../redux/actions/studentActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';

const BASE_URL = 'http://localhost:5000';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, error } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    dispatch(getStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        password: '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.email) data.append('email', formData.email);
    if (formData.phone) data.append('phone', formData.phone);
    if (formData.address) data.append('address', formData.address);
    if (formData.password) data.append('password', formData.password);

    dispatch(updateStudentProfile(data));
    setEditMode(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        password: '',
      });
    }
    setEditMode(false);
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            expanded ? 'lg:ml-64' : 'lg:ml-16'
          }`}
        >
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16 flex items-center justify-center">
            <div className="text-xl text-gray-600">Loading profile...</div>
          </main>
        </div>
        <Notification />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          expanded ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {error}
              </div>
            )}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white rounded-t-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative">
                    <img
                      src={
                        profile.profilePic
                          ? `${BASE_URL}${profile.profilePic}`
                          : `${BASE_URL}/Uploads/default-profile.png`
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {`${profile.firstName} ${profile.lastName}`}
                    </h2>
                    <p className="text-indigo-200 mt-1">{profile.email}</p>
                  </div>
                </div>
              </div>
              {/* Profile Content */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-end mb-4">
                  {editMode ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Email
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profile.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Phone
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profile.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Address
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profile.address || 'Not provided'}</p>
                        )}
                      </div>
                      {editMode && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">
                            New Password (Leave blank to keep current)
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Academic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Academic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Class
                        </label>
                        <p className="text-gray-800">{profile.classId?.name || 'Not assigned'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Class Timeline
                        </label>
                        {profile.classId?.timelinePath ? (
                          <a
                            href={`${BASE_URL}${profile.classId.timelinePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                          >
                            View Timeline
                          </a>
                        ) : (
                          <p className="text-gray-500">No timeline uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Profile;