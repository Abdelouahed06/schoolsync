import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSubjects, addSubject, updateSubject, deleteSubject } from '../../redux/actions/adminActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import SubjectForm from '../../components/admin/SubjectForm';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Subjects = () => {
  const dispatch = useDispatch();
  const { subjects, error } = useSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const subjectsPerPage = 4;

  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSubjectToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSubject(subjectToDelete));
    setDeleteModalOpen(false);
    setSubjectToDelete(null);
  };

  const handleSubmit = (formData) => {
    if (selectedSubject) {
      dispatch(updateSubject(selectedSubject._id, formData));
    } else {
      dispatch(addSubject(formData));
    }
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubjects = filteredSubjects.length;
  const totalPages = Math.ceil(totalSubjects / subjectsPerPage);
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-6 pt-6 pb-6 border-b-2 border-[F3F4F6]">
              Manage Subjects
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by subject name"
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleAdd}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md w-full sm:w-auto"
              >
                Add Subject
              </button>
            </div>

            <div className="grid grid-cols-1 sm:hidden gap-4">
              {currentSubjects.map((subject, index) => (
                <div key={subject._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="text-sm text-gray-600 mb-1">#{String(indexOfFirstSubject + index + 1).padStart(2, '0')}</div>
                  <div className="font-semibold text-gray-800">{subject.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button onClick={() => handleEdit(subject)} className="text-indigo-600 hover:text-indigo-900 text-sm"><FaEdit /></button>
                    <button onClick={() => handleDelete(subject._id)} className="text-red-600 hover:text-red-900 text-sm"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
            {filteredSubjects.length === 0 && (
              <div className="sm:hidden text-center text-gray-500 mt-4">
                No Subjects found.
              </div>
            )}


            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-700">
                  <tr>
                    {['Order', 'Name', 'Actions'].map((col) => (
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
                  {currentSubjects.map((subject, index) => (
                    <tr key={subject._id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {String(indexOfFirstSubject + index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {subject.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(subject)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEdit /></button>
                        <button onClick={() => handleDelete(subject._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {filteredSubjects.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No Subjects found.
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
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this subject?</h3>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedSubject ? 'Edit Subject' : 'Add Subject'}>
              <SubjectForm
                subject={selectedSubject}
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
              />
            </Modal>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Subjects;