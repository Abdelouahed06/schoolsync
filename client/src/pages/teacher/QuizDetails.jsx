import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, clearCurrentQuiz } from '../../redux/actions/teacherActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import SubmissionGrading from '../../components/teacher/SubmissionGrading';
import Table from '../../components/common/Table';
import { ArrowLeft, Eye } from 'lucide-react'; // Import ArrowLeft and Eye icons

const QuizDetails = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, error } = useSelector((state) => state.teacher);

  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);

  // Define the backend base URL
  const BASE_URL = 'http://localhost:5000'; // Adjust this to match your backend server URL

  useEffect(() => {
    dispatch(getQuiz(quizId));

    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, quizId]);

  // Update filtered submissions whenever currentQuiz, classFilter, or nameSearch changes
  useEffect(() => {
    if (!currentQuiz || !currentQuiz.submissions) {
      setFilteredSubmissions([]);
      return;
    }

    let submissions = [...currentQuiz.submissions];

    // Filter by class
    if (classFilter) {
      submissions = submissions.filter(
        (submission) =>
          submission.studentId?.classId?._id === classFilter ||
          submission.studentId?.classId === classFilter // Handle both populated and ID-only cases
      );
    }

    // Search by name
    if (nameSearch) {
      const searchLower = nameSearch.toLowerCase();
      submissions = submissions.filter(
        (submission) =>
          submission.studentId?.firstName?.toLowerCase().includes(searchLower) ||
          submission.studentId?.lastName?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSubmissions(submissions);
  }, [currentQuiz, classFilter, nameSearch]);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsGradingModalOpen(true);
  };

  const handleViewFile = (filePath) => {
    // Construct the full URL for the file
    const fullUrl = `${BASE_URL}${filePath}`;
    // Open the file in a new tab
    window.open(fullUrl, '_blank');
  };

  const tableHeaders = ['Student', 'Class', 'Submitted At', 'Answers', 'Grade', 'Actions'];

  const getSubmissionsTableData = () => {
    return filteredSubmissions.map((submission) => {
      // Safely parse submittedAt
      let submittedAtDisplay = 'Not submitted yet';
      if (submission.submittedAt) {
        try {
          const date = new Date(submission.submittedAt);
          if (!isNaN(date.getTime())) {
            submittedAtDisplay = date.toLocaleString();
          } else {
            console.warn('Invalid date for submission:', submission._id, submission.submittedAt);
          }
        } catch (error) {
          console.error('Error parsing date for submission:', submission._id, error);
        }
      }

      return {
        student: `${submission.studentId?.firstName} ${submission.studentId?.lastName}` || 'N/A',
        class: submission.studentId?.classId?.name || 'N/A',
        submittedAt: submittedAtDisplay,
        answers: submission.answers.map((ans, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {currentQuiz.type === 'file_upload' ? (
              <>
                <span>Q{ans.questionIndex + 1}:</span>
                <button
                  onClick={() => handleViewFile(ans.answer)}
                  className="text-indigo-600 hover:text-indigo-800"
                  title="View File"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div>
                Q{ans.questionIndex + 1}: {ans.answer}
              </div>
            )}
          </div>
        )),
        grade:
          submission.grade !== null && submission.grade !== undefined
            ? submission.grade
            : 'Not graded',
        actions:
          currentQuiz.type !== 'qcm' ? (
            <button
              onClick={() => handleGradeSubmission(submission)}
              className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Grade
            </button>
          ) : (
            'Auto-graded'
          ),
      };
    });
  };

  // Get unique classes for the filter dropdown
  const getClassOptions = () => {
    if (!currentQuiz || !currentQuiz.submissions) return [];
    const classes = new Set();
    currentQuiz.submissions.forEach((submission) => {
      if (submission.studentId?.classId) {
        classes.add(
          JSON.stringify({
            id: submission.studentId.classId._id || submission.studentId.classId,
            name: submission.studentId.classId.name || 'Unknown',
          })
        );
      }
    });
    return Array.from(classes)
      .map((cls) => JSON.parse(cls))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  if (!currentQuiz) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            expanded ? 'lg:ml-64' : 'lg:ml-16'
          }`}
        >
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-2 sm:p-4 lg:p-8 pt-16 lg:pt-16">
            <div className="max-w-5xl mx-auto">
              <p className="text-gray-500">Loading quiz details...</p>
            </div>
          </main>
        </div>
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
        <main className="flex-1 p-2 sm:p-4 lg:p-8 pt-16 lg:pt-16">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 mt-4 sm:mb-6 space-y-2 sm:space-y-0">
              <button
                onClick={() => navigate('/teacher/quizzes')}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Quizzes
              </button>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Quiz Details Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 text-gray-800">
                {currentQuiz.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                Subject: {currentQuiz.subject?.name || 'N/A'}
              </p>
              <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                Classes: {currentQuiz.classIds?.map(cls => cls.name).join(', ') || 'N/A'}
              </p>
              <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                Type: {currentQuiz.type === 'qcm' ? 'QCM' : currentQuiz.type === 'direct_answer' ? 'Direct Answer' : 'File Upload'}
              </p>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Status: {currentQuiz.isPublished ? 'Published' : 'Draft'}
              </p>

              {/* Questions Section */}
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">
                Questions
              </h3>
              {currentQuiz.questions.map((q, index) => (
                <div
                  key={index}
                  className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {index + 1}. {q.question}
                  </p>
                  {q.options?.length > 0 && (
                    <ul className="list-disc pl-4 sm:pl-5 mt-1 sm:mt-2 text-gray-700 text-sm sm:text-base">
                      {q.options.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={option === q.correctAnswer ? 'text-green-600' : ''}
                        >
                          {option} {option === q.correctAnswer ? '(Correct)' : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.correctAnswer && currentQuiz.type === 'direct_answer' && (
                    <p className="mt-1 sm:mt-2 text-gray-700 text-sm sm:text-base">
                      Correct Answer: <span className="text-green-600">{q.correctAnswer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Submissions Section */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">
                Submissions
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Class
                  </label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  >
                    <option value="">All Classes</option>
                    {getClassOptions().map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Name
                  </label>
                  <input
                    type="text"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    placeholder="Search student name..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Submissions Display */}
              {filteredSubmissions.length > 0 ? (
                <>
                  {/* Table for Medium and Larger Screens */}
                  <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <Table
                      headers={tableHeaders}
                      data={getSubmissionsTableData()}
                      headerClassName="bg-indigo-700 text-white"
                      rowClassName="hover:bg-indigo-50 transition-colors"
                    />
                  </div>

                  {/* Cards for Small Screens */}
                  <div className="md:hidden space-y-4">
                    {filteredSubmissions.map((submission, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
                      >
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Student:</span>{' '}
                          {`${submission.studentId?.firstName} ${submission.studentId?.lastName}` || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Class:</span>{' '}
                          {submission.studentId?.classId?.name || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Submitted At:</span>{' '}
                          {submission.submittedAt
                            ? new Date(submission.submittedAt).toLocaleString()
                            : 'Not submitted yet'}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Answers:</span>
                          <div className="mt-1">
                            {submission.answers.map((ans, idx) => (
                              <div key={idx} className="text-gray-600 flex items-center gap-2">
                                {currentQuiz.type === 'file_upload' ? (
                                  <>
                                    <span>Q{ans.questionIndex + 1}:</span>
                                    <button
                                      onClick={() => handleViewFile(ans.answer)}
                                      className="text-indigo-600 hover:text-indigo-800"
                                      title="View File"
                                    >
                                      <Eye className="w-5 h-5" />
                                    </button>
                                  </>
                                ) : (
                                  <div>
                                    Q{ans.questionIndex + 1}: {ans.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">Grade:</span>{' '}
                          {submission.grade !== null && submission.grade !== undefined
                            ? submission.grade
                            : 'Not graded'}
                        </div>
                        <div>
                          {currentQuiz.type !== 'qcm' ? (
                            <button
                              onClick={() => handleGradeSubmission(submission)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                            >
                              Grade
                            </button>
                          ) : (
                            <span className="text-gray-600">Auto-graded</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No submissions found.</p>
              )}
            </div>

            {/* Grading Modal */}
            <Modal
              isOpen={isGradingModalOpen}
              onClose={() => setIsGradingModalOpen(false)}
              title="Grade Submission"
            >
              <SubmissionGrading
                quizId={currentQuiz?._id}
                submission={selectedSubmission}
                onClose={() => setIsGradingModalOpen(false)}
              />
            </Modal>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default QuizDetails;