import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitQuiz } from '../../redux/actions/studentActions';
import { FaArrowLeft, FaChevronRight, FaChevronLeft, FaCheck, FaFileUpload, FaSpinner } from 'react-icons/fa';

const QuizDetails = ({ quiz, onClose }) => {
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    quiz.questions.map(() => ({ answer: '', file: null }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleFileChange = (index, file) => {
    const newAnswers = [...answers];
    newAnswers[index].file = file;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const answersToSubmit = quiz.questions.map((q, index) => {
        if (quiz.type === 'file_upload') {
          return {
            questionIndex: index,
            answer: 'file',
          };
        }
        return {
          questionIndex: index,
          answer: answers[index].answer,
        };
      });

      formData.append('answers', JSON.stringify(answersToSubmit));

      if (quiz.type === 'file_upload') {
        answers.forEach((answer, index) => {
          if (answer.file) {
            formData.append(`file`, answer.file);
          }
        });
      }

      await dispatch(submitQuiz(quiz._id, formData));
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <button 
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-blue-700 transition"
              aria-label="Close quiz"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <h2 className="text-xl font-bold text-center flex-1 px-4 line-clamp-1">
              {quiz.title}
            </h2>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-blue-100">{quiz.subject?.name}</span>
              <span className="text-blue-200 text-xs">•</span>
              <span className="text-blue-100 text-sm">
                {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {quiz.type === 'qcm' ? 'MULTIPLE CHOICE' : quiz.type.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
            }}
          />
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center space-x-2 p-3 bg-gray-50">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${currentQuestionIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        {/* Question Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-1 text-sm text-gray-500 font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <h3 className="text-lg font-semibold mb-6">
            {currentQuestion.question}
          </h3>
          
          {quiz.type === 'qcm' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${answers[currentQuestionIndex].answer === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0
                      ${answers[currentQuestionIndex].answer === option 
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : 'border-gray-300'}
                    `}>
                      {answers[currentQuestionIndex].answer === option && 
                        <FaCheck className="text-xs" />}
                    </div>
                    <span className="text-left">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {quiz.type === 'direct_answer' && (
            <input
              type="text"
              value={answers[currentQuestionIndex].answer}
              onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type your answer here..."
              required
            />
          )}

          {quiz.type === 'file_upload' && (
            <div className="flex flex-col items-start">
              <label className="flex items-center px-4 py-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <FaFileUpload className="mr-2 text-gray-600" />
                {answers[currentQuestionIndex].file 
                  ? answers[currentQuestionIndex].file.name 
                  : 'Upload File'}
                <input
                  type="file"
                  onChange={(e) => handleFileChange(currentQuestionIndex, e.target.files[0])}
                  className="hidden"
                  required
                />
              </label>
              {answers[currentQuestionIndex].file && (
                <span className="mt-2 text-sm text-gray-600">
                  Selected: {answers[currentQuestionIndex].file.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2.5 rounded-lg flex items-center font-medium
                ${currentQuestionIndex === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'}
              `}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={
                  quiz.type === 'file_upload' 
                    ? !answers[currentQuestionIndex].file 
                    : !answers[currentQuestionIndex].answer
                }
                className={`px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors
                  ${(
                    quiz.type === 'file_upload' 
                      ? !answers[currentQuestionIndex].file 
                      : !answers[currentQuestionIndex].answer
                  ) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
              >
                Next
                <FaChevronRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || quiz.questions.some((_, index) => 
                  quiz.type === 'file_upload' 
                    ? !answers[index].file 
                    : !answers[index].answer
                )}
                className={`px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors
                  ${isSubmitting || quiz.questions.some((_, index) => 
                    quiz.type === 'file_upload' 
                      ? !answers[index].file 
                      : !answers[index].answer
                  )
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuizDetails;