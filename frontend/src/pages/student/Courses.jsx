import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

function Course(props) {
  return (
    <div
      className="bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 w-full relative group"
      style={{
        borderRadius: "0.5rem",
        padding: "2px",
      }}
    >
      <div
        className="absolute inset-0 rounded-lg overflow-hidden z-0"
        style={{
          background:
            "linear-gradient(45deg, #6ee7b7, #3b82f6, #9333ea, #f43f5e)",
          filter: "blur(8px)",
          zIndex: -1,
        }}
      ></div>

      <div
        className="relative rounded-lg overflow-hidden z-10"
        style={{
          background: "linear-gradient(to right, #1f2937, #111827)",
          borderRadius: "0.5rem",
        }}
      >
        <figure className="relative h-48 w-full overflow-hidden">
          <img
            src={props.data.imageUrl}
            alt="Course"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-xl font-bold">
              {props.data.courseName}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text ml-2">
                English
              </span>
            </h2>
          </div>
        </figure>
        <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-blue-950">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <p className="text-sm">
                Mode: <span className="font-medium text-gray-200">Online</span>
              </p>
              <p className="text-sm">
                Status:{" "}
                <span className="text-green-400 font-medium">Ongoing</span>
              </p>
            </div>
            <div>
              <p className="text-sm">
                Price:{" "}
                <span className="font-medium text-gray-200">
                  ${props.data.price}
                </span>
              </p>
              <p className="text-sm">
                Duration:{" "}
                <span className="font-medium text-gray-200">
                  {props.data.duration} days
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              Free Internship:{" "}
              <span className="text-green-400 font-medium">Available</span>
            </p>
            <p className="text-sm">
              Certificate:{" "}
              <span className="font-medium text-gray-200">
                Completion + Internship
              </span>
            </p>
            <p className="text-sm">
              Recordings:{" "}
              <span className="font-medium text-gray-200">
                {props.data.hours}+ hrs
              </span>
            </p>
          </div>
          <div className="mt-4 sm:mt-6">
            <Link to={`/buy-now/${props.data.nextId}/${props.data._id}`}>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-4 sm:px-6 py-1 sm:py-2 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Visit & Buy Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);

  async function fetchCourses() {
    const response = await axios.get("http://localhost:4000/show-courses", {
      withCredentials: true,
    });
    setCourses(response?.data?.data);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  if (courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-white">
        No courses found
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-900 p-2 sm:p-4">
        <div className="container mx-auto px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-6">
            Courses
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {courses.map((x, index) => (
              <Course key={index} data={x} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
