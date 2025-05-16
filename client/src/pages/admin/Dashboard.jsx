import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import DashboardStats from '../../components/admin/DashboardStats';

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-64' : 'lg:ml-16'
          }`}
      >
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pt-6 pb-6 border-b-2 border-gray-200">
              School Statistic
            </h1>
            <br></br>
            <div className="mb-6 flex justify-center md:hidden">
              <img
                src="/Welcome.svg"
                alt="Welcome illustration"
                className="w-full max-w-xs sm:max-w-sm h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <DashboardStats />
            </div>
            <div className="mb-6 mt-3 justify-center hidden lg:flex">
              <img
                src="/Welcome.svg"
                alt="Welcome illustration"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Dashboard;