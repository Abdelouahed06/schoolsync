import React from 'react';
import { FaQuestionCircle, FaPenAlt, FaFileUpload } from 'react-icons/fa';

const QuizCard = ({ quiz, onTakeQuiz }) => {
  const getQuizTypeIcon = () => {
    switch (quiz.type) {
      case 'qcm':
        return <FaQuestionCircle className="text-blue-500" />;
      case 'direct_answer':
        return <FaPenAlt className="text-green-500" />;
      case 'file_upload':
        return <FaFileUpload className="text-purple-500" />;
      default:
        return <FaQuestionCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              {quiz.subject?.name || 'General'}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {quiz.questions.length} Qs
            </span>
          </div>
        </div>
        <div className="text-2xl p-2 bg-gray-50 rounded-full">
          {getQuizTypeIcon()}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          By {quiz.teacherId?.firstName} {quiz.teacherId?.lastName}
        </span>
        <button
          onClick={() => onTakeQuiz(quiz)}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;