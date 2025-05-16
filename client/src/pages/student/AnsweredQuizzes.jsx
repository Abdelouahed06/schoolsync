import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAnsweredQuizzes } from '../../redux/actions/studentActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const AnsweredQuizzes = () => {
  const dispatch = useDispatch();
  const { answeredQuizzes, error } = useSelector((state) => state.student);

  const [filterSubject, setFilterSubject] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    dispatch(getAnsweredQuizzes(filterSubject));
  }, [dispatch, filterSubject]);

  useEffect(() => {
    const newSubjects = answeredQuizzes
      .filter((quiz) => quiz.subject && quiz.subject._id && quiz.subject.name)
      .map((quiz) => ({ _id: quiz.subject._id, name: quiz.subject.name }));

    setAllSubjects((prevSubjects) => {
      const subjectMap = new Map(
        [...prevSubjects, ...newSubjects].map((subject) => [subject._id, subject])
      );
      return [...subjectMap.values()].sort((a, b) => a.name.localeCompare(b.name));
    });
  }, [answeredQuizzes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [answeredQuizzes.length]);

  const totalPages = Math.ceil(answeredQuizzes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = answeredQuizzes.slice(indexOfFirstItem, indexOfLastItem);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaTimesCircle className="text-red-500" />;
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
                Answered Quizzes
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

            {answeredQuizzes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">
                  You haven't answered any quizzes yet.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Quiz Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Submitted At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentQuizzes.map((quiz) => (
                        <tr key={quiz._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {quiz.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {quiz.subject?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {quiz.submission?.submittedAt
                              ? new Date(quiz.submission.submittedAt).toLocaleString()
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(quiz.submission?.status)}
                              <span className="ml-2 capitalize">
                                {quiz.submission?.status || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {quiz.submission?.grade !== null && quiz.submission?.grade !== undefined
                              ? quiz.submission.grade
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default AnsweredQuizzes;