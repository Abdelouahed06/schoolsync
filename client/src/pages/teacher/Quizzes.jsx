import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  getTeacherClasses,
} from '../../redux/actions/teacherActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import QuizForm from '../../components/teacher/QuizForm';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

const Quizzes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes, classes, error } = useSelector((state) => state.teacher);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filterClassId, setFilterClassId] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    dispatch(getQuizzes(filterClassId));
    dispatch(getTeacherClasses());
  }, [dispatch, filterClassId]);

  const handleAddQuiz = () => {
    setSelectedQuiz(null);
    setIsQuizModalOpen(true);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizToDelete(quizId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (quizToDelete) {
      dispatch(deleteQuiz(quizToDelete));
      setQuizToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleQuizSubmit = (formData) => {
    if (selectedQuiz) {
      dispatch(updateQuiz(selectedQuiz._id, formData));
    } else {
      dispatch(addQuiz(formData));
    }
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          expanded ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quizzes</h1>
            <p className="text-gray-600 mb-4">Manage and organize your teaching materials</p>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg">{error}</div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="w-full sm:w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Class
                  </label>
                  <select
                    value={filterClassId}
                    onChange={(e) => setFilterClassId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddQuiz}
                  className="flex items-center gap-2 w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow-md"
                >
                  <Plus size={18} /> Add Quiz
                </button>
              </div>

              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
                  <p className="mt-1 text-sm text-gray-500">Create your first quiz to get started.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddQuiz}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    >
                      <Plus size={16} className="mr-2" /> Add Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentQuizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                          <p className="text-gray-600 text-sm mb-1">
                            Subject: {quiz.subject?.name || 'N/A'}
                          </p>
                          <p className="text-gray-600 text-sm mb-1">
                            Classes: {quiz.classIds?.map((cls) => cls.name).join(', ') || 'N/A'}
                          </p>
                          <p className="text-gray-600 text-sm mb-1">
                            Type: {quiz.type === 'qcm' ? 'QCM' : quiz.type === 'direct_answer' ? 'Direct Answer' : 'File Upload'}
                          </p>
                          <p className="text-gray-600 text-sm mb-4">
                            Status: {quiz.isPublished ? 'Published' : 'Draft'}
                          </p>
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => handleViewQuiz(quiz._id)}
                              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                              title="View Quiz"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditQuiz(quiz)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                              title="Edit Quiz"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(quiz._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Delete Quiz"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        Previous
                      </button>

                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <Modal
              isOpen={isQuizModalOpen}
              onClose={() => setIsQuizModalOpen(false)}
              title={selectedQuiz ? 'Edit Quiz' : 'Add Quiz'}
            >
              <QuizForm
                quiz={selectedQuiz}
                onSubmit={handleQuizSubmit}
                onClose={() => setIsQuizModalOpen(false)}
              />
            </Modal>

            <CustomModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title="Confirm Deletion"
            >
              <div className="text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this quiz?</h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDelete}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </CustomModal>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Quizzes;