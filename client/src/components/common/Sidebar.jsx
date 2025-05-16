import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaUser, FaChalkboardTeacher, FaSchool, FaUserGraduate, FaBook, FaQuestionCircle, FaComments } from 'react-icons/fa';

const Sidebar = ({ expanded, setExpanded }) => {
  const { userType } = useSelector((state) => state.auth);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaBook /> },
    { name: 'Profile', path: '/admin/profile', icon: <FaUser /> },
    { name: 'Teachers', path: '/admin/teachers', icon: <FaChalkboardTeacher /> },
    { name: 'Students', path: '/admin/students', icon: <FaUserGraduate /> },
    { name: 'Classes', path: '/admin/classes', icon: <FaSchool /> },
    { name: 'Subjects', path: '/admin/subjects', icon: <FaBook /> },
  ];

  const teacherLinks = [
    { name: 'Profile', path: '/teacher/profile', icon: <FaUser /> },
    { name: 'Classes', path: '/teacher/classes', icon: <FaSchool /> },
    { name: 'Courses', path: '/teacher/courses', icon: <FaBook /> },
    { name: 'Quizzes', path: '/teacher/quizzes', icon: <FaQuestionCircle /> },
    { name: 'Chat', path: '/teacher/chat', icon: <FaComments /> },
  ];

  const studentLinks = [
    { name: 'Profile', path: '/student/profile', icon: <FaUser /> },
    { name: 'Courses', path: '/student/courses', icon: <FaBook /> },
    { name: 'Quizzes', path: '/student/quizzes', icon: <FaQuestionCircle /> },
    { name: 'Answered Quizzes', path: '/student/answered-quizzes', icon: <FaQuestionCircle /> },
    { name: 'Chat', path: '/student/chat', icon: <FaComments /> },
  ];

  const links = userType === 'admin' ? adminLinks : userType === 'teacher' ? teacherLinks : studentLinks;

  const handleProfileClick = () => {
    window.open('https://github.com/Abdelouahed06', '_blank');
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg z-40 transition-transform duration-300 
          ${expanded ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:${expanded ? 'w-64' : 'w-16'}`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <div className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}>
              <span className="text-lg font-bold">NSET</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="flex-1 px-3 py-4">
            {links.map((link) => (
              <li key={link.name} className="relative my-1">
                <NavLink
                  to={link.path}
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded-md transition-colors group ${
                      isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
                    {link.name}
                  </span>
                  {!expanded && (
                    <div
                      className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-blue-600 text-white text-sm
                        invisible opacity-0 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                        lg:block hidden
                      `}
                    >
                      {link.name}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-700 flex p-3">
            <div className="relative group">
              <img
                src="https://ui-avatars.com/api/?name=E+A&background=c7d2fe&color=3730a3&bold=true"
                alt="User avatar"
                className="w-10 h-10 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleProfileClick}
              />
              {!expanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible transition-opacity duration-200 group-hover:opacity-100 group-hover:visible whitespace-nowrap lg:block hidden">
                  EsAb GitHub
                </div>
              )}
            </div>
            <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
              <div className="leading-4">
                <h4 className="font-semibold">EsAb</h4>
                <span className="text-xs text-gray-400">EsAb.dev@gmail.com</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      {expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;