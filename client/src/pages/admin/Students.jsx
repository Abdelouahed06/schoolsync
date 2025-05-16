import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getClasses,
} from '../../redux/actions/adminActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/admin/StudentForm';
import { FaEdit, FaTrash, FaSearch, FaImage } from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000';

const Students = () => {
  const dispatch = useDispatch();
  const { students, classes, error } = useSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchData, setSearchData] = useState({ name: '', classId: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const studentsPerPage = 6;

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteStudent(studentToDelete));
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleSubmit = async (formData) => {
    if (selectedStudent) {
      await dispatch(updateStudent(selectedStudent._id, formData));
    } else {
      await dispatch(addStudent(formData));
    }
    dispatch(getStudents());
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const filteredStudents = students.filter((student) => {
    const matchesName =
      searchData.name === '' ||
      (student.firstName && student.firstName.toLowerCase().includes(searchData.name.toLowerCase())) ||
      (student.lastName && student.lastName.toLowerCase().includes(searchData.name.toLowerCase()));
    const matchesClass =
      searchData.classId === '' || student.classId?._id === searchData.classId;
    return matchesName && matchesClass;
  });

  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-6 pt-6 pb-6 border-b-2 border-[F3F4F6]">
              Manage Students
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={searchData.name}
                    onChange={handleSearchChange}
                    placeholder="Search by name"
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  name="classId"
                  value={searchData.classId}
                  onChange={handleSearchChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAdd}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md w-full sm:w-auto"
              >
                Add Student
              </button>
            </div>

            <div className="grid grid-cols-1 sm:hidden gap-4">
              {currentStudents.map((student, index) => (
                <div key={student._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="text-sm text-gray-600 mb-1">#{String(indexOfFirstStudent + index + 1).padStart(2, '0')}</div>
                  <div className="font-semibold text-gray-800">{student.firstName} {student.lastName}</div>
                  <div className="text-sm text-gray-600">{student.email || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Class: {student.classId?.name || 'N/A'}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {student.profilePic ? (
                      <button
                        onClick={() => handleImageClick(`${BASE_URL}${student.profilePic}`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                      >
                        <FaImage /> View
                      </button>
                    ) : 'No Image'}
                    <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900 text-sm"><FaEdit /></button>
                    <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-900 text-sm"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
            {filteredStudents.length === 0 && (
              <div className="sm:hidden text-center text-gray-500 mt-4">
                No students found.
              </div>
            )}



            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-700">
                  <tr>
                    {['Order', 'First Name', 'Last Name', 'Email', 'Class', 'Profile', 'Actions'].map((col) => (
                      <th
                        key={col}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.map((student, index) => (
                    <tr key={student._id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{String(indexOfFirstStudent + index + 1).padStart(2, '0')}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.firstName || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.lastName || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.email || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.classId?.name || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {student.profilePic ? (
                          <button onClick={() => handleImageClick(`${BASE_URL}${student.profilePic}`)} className="flex items-center text-indigo-600 hover:text-indigo-800">
                            <FaImage className="mr-1" /> View
                          </button>
                        ) : 'No Image'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEdit /></button>
                        <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-4">
                      No students found.
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 flex-wrap gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            <div
              id="delete-confirm-modal"
              tabIndex="-1"
              className={`${deleteModalOpen ? 'flex' : 'hidden'} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50 w-full h-full`}
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this student?</h3>
                    <button
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                      onClick={confirmDelete}
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      type="button"
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => setDeleteModalOpen(false)}
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedStudent ? 'Edit Student' : 'Add Student'}>
              <StudentForm student={selectedStudent} onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Profile Picture">
              <div className='flex items-center justify-center'>
                {selectedImage && <img src={selectedImage} alt="Full Profile Pic" className="w-[300px] h-[300px] object-contain rounded-lg" />}
              </div>
            </Modal>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Students;