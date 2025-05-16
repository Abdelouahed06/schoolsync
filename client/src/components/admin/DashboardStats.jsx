import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDashboardStats } from '../../redux/actions/adminActions';
import { FaChalkboardTeacher, FaUserGraduate, FaSchool, FaBook } from 'react-icons/fa';

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { dashboard, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (error) {
    return <div className="text-red-500 p-4 rounded-lg bg-red-50">Error: {error}</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  const stats = [
    {
      title: 'Total Teachers',
      value: dashboard.teachersCount,
      icon: <FaChalkboardTeacher className="text-2xl" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-100'
    },
    {
      title: 'Total Students',
      value: dashboard.studentsCount,
      icon: <FaUserGraduate className="text-2xl" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Total Classes',
      value: dashboard.classesCount,
      icon: <FaSchool className="text-2xl" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-100'
    },
    {
      title: 'Total Subjects',
      value: dashboard.SubjectCount,
      icon: <FaBook className="text-2xl" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-5 transition-all hover:shadow-md`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`${stat.textColor} font-medium text-sm`}>{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.textColor} p-2 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;