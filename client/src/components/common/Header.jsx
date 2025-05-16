import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { getAdminProfile } from '../../redux/actions/adminActions';
import { getTeacherProfile } from '../../redux/actions/teacherActions';
import { getStudentProfile } from '../../redux/actions/studentActions';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaBars } from 'react-icons/fa';

const Header = ({ expanded, setExpanded }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, isAuthenticated } = useSelector((state) => state.auth);
  const { profile: adminProfile } = useSelector((state) => state.admin);
  const { profile: teacherProfile } = useSelector((state) => state.teacher);
  const { profile: studentProfile } = useSelector((state) => state.student);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const BASE_URL = 'http://localhost:5000';

  const profile =
    userType === 'admin'
      ? adminProfile
      : userType === 'teacher'
      ? teacherProfile
      : userType === 'student'
      ? studentProfile
      : null;

  useEffect(() => {
    if (isAuthenticated && !profile) {
      if (userType === 'admin') {
        dispatch(getAdminProfile());
      } else if (userType === 'teacher') {
        dispatch(getTeacherProfile());
      } else if (userType === 'student') {
        dispatch(getStudentProfile());
      }
    }
  }, [dispatch, isAuthenticated, userType, profile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
  };

  const profilePicUrl = profile?.profilePic
    ? `${BASE_URL}${profile.profilePic}`
    : '/not_login.png';

  const fullName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : userType || 'User';

  const email = profile?.email || 'user@example.com';

  return (
    <header className="bg-gray-900 text-white px-4 lg:px-6 py-2.5 shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white focus:ring-2 focus:ring-gray-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="/logo1.png"
              alt="Logo"
              className="h-8"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-lg font-bold">choolSync</span>
          </div>
        </div>
        {isAuthenticated && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center text-sm rounded-full focus:ring-2 focus:ring-gray-700"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={profilePicUrl}
                  alt="User profile"
                  onError={(e) => {
                    e.target.src = '/not_login.png';
                  }}
                />
                <span className="sr-only">Open user menu</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg z-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  <div className="py-3 px-4">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{fullName}</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{email}</span>
                  </div>
                  <ul className="py-1">
                    <li>
                      <a
                        href={`/${userType}/profile`}
                        className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My Profile
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;