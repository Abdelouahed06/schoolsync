import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTeacherClasses } from '../../redux/actions/teacherActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal'; // Added Modal import
import { FaSearch, FaEye } from 'react-icons/fa';

// Use environment variable for base URL, with fallback for development
const BASE_URL = 'http://localhost:5000';

const Classes = () => {
  const dispatch = useDispatch();
  const { classes, error, loading } = useSelector((state) => state.teacher);

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State for modal visibility
  const [selectedImage, setSelectedImage] = useState(''); // State for selected image URL
  const studentsPerPage = 5;

  useEffect(() => {
    dispatch(getTeacherClasses());
  }, [dispatch]);

  // Memoize filtered students to optimize performance
  const filteredStudents = useMemo(() => {
    let students = [];

    if (Array.isArray(classes)) {
      classes.forEach(cls => {
        if (selectedClass === 'all' || cls._id === selectedClass) {
          if (Array.isArray(cls.studentIds)) {
            cls.studentIds.forEach(student => {
              if (student && student._id) {
                students.push({
                  classId: cls._id,
                  className: cls.name || 'Unnamed Class',
                  studentId: student._id,
                  firstName: student.firstName || '',
                  lastName: student.lastName || '',
                  profilePic: student.profilePic || '',
                  timelinePath: cls.timelinePath || '',
                  _id: `${cls._id}-${student._id}`,
                });
              }
            });
          }
        }
      });
    }

    if (studentSearch.trim()) {
      students = students.filter(student =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(studentSearch.trim().toLowerCase())
      );
    }

    return students;
  }, [classes, selectedClass, studentSearch]);

  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler to open modal with selected image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Classes</h1>
            {loading ? (
              <div className="text-center text-gray-500">Loading classes...</div>
            ) : (
              <>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" aria-hidden="true" />
                        <span className="sr-only">Search icon</span>
                      </div>
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => {
                          setStudentSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search students"
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Search students by name"
                      />
                    </div>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Select class"
                    >
                      <option value="all">All Classes</option>
                      {classes && classes.map(cls => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name || 'Unnamed Class'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Responsive Cards on Small Screens */}
                <div className="grid grid-cols-1 sm:hidden gap-4">
                  {currentStudents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                      No students found matching your criteria
                    </div>
                  ) : (
                    currentStudents.map((student) => (
                      <div key={student._id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-start gap-4">
                          {student.profilePic ? (
                            <img
                              src={`${BASE_URL}${student.profilePic}`}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-12 h-12 rounded-full object-cover cursor-pointer"
                              onClick={() => handleImageClick(`${BASE_URL}${student.profilePic}`)}
                              aria-label={`View profile picture of ${student.firstName} ${student.lastName}`}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Pic</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{student.className}</div>
                            {student.timelinePath && (
                              <a
                                href={`${BASE_URL}${student.timelinePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mt-1"
                                aria-label={`View timeline for ${student.firstName} ${student.lastName}`}
                              >
                                <FaEye /> View Timeline
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Table Wrapper - Desktop Only */}
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto hidden sm:block">
                  <table className="min-w-full divide-y divide-gray-200" role="grid">
                    <thead className="bg-indigo-700">
                      <tr>
                        {['Order', 'Profile', 'Class', 'First Name', 'Last Name', 'Timeline'].map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentStudents.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No students found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        currentStudents.map((student, index) => (
                          <tr key={student._id} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {String(indexOfFirstStudent + index + 1).padStart(2, '0')}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {student.profilePic ? (
                                <img
                                  src={`${BASE_URL}${student.profilePic}`}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                  onClick={() => handleImageClick(`${BASE_URL}${student.profilePic}`)}
                                  aria-label={`View profile picture of ${student.firstName} ${student.lastName}`}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">No Pic</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                              {student.className}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                              {student.firstName}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                              {student.lastName}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {student.timelinePath ? (
                                <a
                                  href={`${BASE_URL}${student.timelinePath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                                  aria-label={`View timeline for ${student.firstName} ${student.lastName}`}
                                >
                                  <FaEye className="mr-1" /> View
                                </a>
                              ) : (
                                'No timeline'
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 flex-wrap gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors`}
                        aria-label={`Page ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <Notification />
      {/* Modal for displaying full-size profile picture */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Profile Picture">
        <div className="flex items-center justify-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Profile Pic"
              className="w-[300px] h-[300px] object-contain rounded-lg"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Classes;