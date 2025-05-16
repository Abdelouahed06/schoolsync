import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAvailableQuizzes } from '../../redux/actions/studentActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import QuizCard from '../../components/student/QuizCard';
import QuizDetails from './QuizDetails';

const Quizzes = () => {
  const dispatch = useDispatch();
  const { availableQuizzes, error } = useSelector((state) => state.student);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    dispatch(getAvailableQuizzes(filterSubject));
  }, [dispatch, filterSubject]);

  useEffect(() => {
    const newSubjects = availableQuizzes
      .filter((quiz) => quiz.subject && quiz.subject._id && quiz.subject.name)
      .map((quiz) => ({ _id: quiz.subject._id, name: quiz.subject.name }));

    setAllSubjects((prevSubjects) => {
      const subjectMap = new Map(
        [...prevSubjects, ...newSubjects].map((subject) => [subject._id, subject])
      );
      return [...subjectMap.values()].sort((a, b) => a.name.localeCompare(b.name));
    });
  }, [availableQuizzes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [availableQuizzes.length]);

  const handleTakeQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    dispatch(getAvailableQuizzes(filterSubject));
  };

  const totalPages = Math.ceil(availableQuizzes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = availableQuizzes.slice(indexOfFirstItem, indexOfLastItem);

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
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Available Quizzes
              </h1>
              <div className="w-full sm:w-64">
                <select
                  id="filterSubject"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Subjects</option>
                  {allSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {error}
              </div>
            )}

            {availableQuizzes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">
                  No quizzes available at the moment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz._id}
                      quiz={quiz}
                      onTakeQuiz={handleTakeQuiz}
                    />
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
                      aria-label="Previous page"
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
                          aria-label={`Go to page ${page}`}
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
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title={selectedQuiz?.title}
          >
            {selectedQuiz && (
              <QuizDetails
                quiz={selectedQuiz}
                onClose={handleModalClose}
              />
            )}
          </Modal>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Quizzes;