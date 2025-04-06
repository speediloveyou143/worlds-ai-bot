import React from 'react';
import { useSelector } from 'react-redux';
import Courses from './Courses';
import { Link } from 'react-router-dom';

function Lectures() {
  const { user } = useSelector((state) => state.user || {});
  const courses = user?.courses || [];

  return (
    <div className="p-2 mt-2 mb-24 bg-gradient-to-br from-gray-950  text-white">
      {user ? (
        courses.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Paid Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gray-900/50 border border-blue-800/30 hover:border-blue-600/50 transition-all"
                >
                  <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {course.courseName}
                  </h3>
                  <p className="text-gray-300 text-sm">Amount Paid: ₹{course.amount}</p>
                  <p className="text-gray-300 text-sm">Transaction ID: {course.transactionId}</p>
                  <p className="text-gray-300 text-sm">Purchased By: {course.name}</p>
                  <p className="text-gray-300 text-sm">Gmail: {course.email}</p>
                  <p
                    className={`font-medium mt-2 text-sm ${
                      course.status ? 'text-green-400' : 'text-red-500'
                    }`}
                  >
                    Status: {course.status ? 'Active' : 'Expired'}
                  </p>
                  {course.status && (
                    <Link to={`/student-dashboard/profile/recordings/${course.recordingsId}`}>
                      <button className="mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm">
                        Watch Recordings
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              No Paid Courses
            </h2>
            <p className="text-gray-300 mb-4 text-sm">Please purchase a course to access lectures.</p>
            <Courses />
          </div>
        )
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading...
          </h2>
        </div>
      )}
    </div>
  );
}

export default Lectures;