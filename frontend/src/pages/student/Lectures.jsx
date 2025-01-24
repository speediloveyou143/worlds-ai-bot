import React from 'react';
import { useSelector } from 'react-redux';
import Courses from './Courses';
import { Link } from 'react-router-dom';
function Lectures() {
  // Access the Redux state
  const { user } = useSelector((state) => state.user || {});

  const courses = user?.courses || [];

  return (
    <div className="p-6 ">
      {user ? (
        courses.length > 0 ? (
          <div >
            <h2 className="text-2xl font-semibold mb-4">Your Paid Courses</h2>
            <div className="flex flex-wrap align-center ">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-4 rounded-lg shadow-sm w-full max-w-md text-left m-4"
                >
                  <h3 className="text-lg font-bold">{course.courseName}</h3>
                  <p className="text-white">Amount Paid: ₹{course.amount}</p>
                  <p className="text-white">Transaction ID: {course.transactionId}</p>
                  <p className="text-white">Purchased By: {course.name}</p>
                  <p className="text-white">Gmail: {course.email}</p>
                  <p
                    className={`font-medium ${
                      course.status ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Status: {course.status ? 'Active' : 'Expired'}
                  </p>
                  <Link to={"/student-dashboard/profile/recordings/"+course.recordingsId}>{
                    course.status?<button className='badge bg-primary rounded text-black p-5'>Recordings</button>:""
                  }</Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">No Paid Courses please purchase the course</h2>
            <Courses/>
          </div>
        )
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        </div>
      )}
    </div>
  );
}

export default Lectures;
