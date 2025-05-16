import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitQuiz } from '../../redux/actions/studentActions';

const QuizSubmissionForm = ({ quiz, onClose }) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState(quiz.questions.map(() => ''));

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submission = {
      answers: quiz.questions.map((q, index) => ({
        questionId: q._id,
        answer: answers[index],
      })),
    };
    dispatch(submitQuiz(quiz._id, submission));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      {quiz.questions.map((q, index) => (
        <div key={q._id} className="mb-4 p-4 border rounded">
          <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
          {q.options.map((option, optIndex) => (
            <div key={optIndex} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="mr-2"
                  required
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      </div>
    </form>
  );
};

export default QuizSubmissionForm;