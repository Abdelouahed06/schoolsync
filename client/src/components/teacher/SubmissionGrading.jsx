import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { gradeSubmission } from '../../redux/actions/teacherActions';

const SubmissionGrading = ({ quizId, submission, onClose }) => {
  const dispatch = useDispatch();
  const [grade, setGrade] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade)) {
      alert('Please enter a valid number for the grade.');
      return;
    }
    dispatch(gradeSubmission(quizId, submission._id, numericGrade));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Grade</label>
        <input
          type="number"
          step="0.01"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
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
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Grade
        </button>
      </div>
    </form>
  );
};

export default SubmissionGrading;