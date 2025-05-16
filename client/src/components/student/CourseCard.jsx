import React from 'react';
import { useDispatch } from 'react-redux';
import { getCourseDetails } from '../../redux/actions/studentActions';

const CourseCard = ({ course }) => {
  const dispatch = useDispatch();

  const handleViewDetails = () => {
    dispatch(getCourseDetails(course._id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-gray-600 mt-2">{course.description || 'No description'}</p>
      <p className="text-gray-600 mt-2">Subject: {course.subject?.name || 'N/A'}</p>
      <button
        onClick={handleViewDetails}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
};

export default CourseCard;