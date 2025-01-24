import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateInvoice = () => {
  const { id } = useParams();
  const [courses, setCourses] = useState([
    {
      transactionId: "",
      amount: 0,
      status: false,
      courseName: "",
      email: "",
      name: "",
      recordingsId: "12345",
    },
  ]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/show-user/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          const userCourses = response.data.courses || [];
          setCourses(userCourses.length > 0 ? userCourses : [
            {
              transactionId: "",
              amount: 0,
              status: false,
              courseName: "",
              email: "",
              name: "",
              recordingsId: "12345",
            },
          ]);
        }
      } catch (error) {
        setMessage("Failed to fetch courses.");
      }
    };

    fetchCourses();
  }, [id]);

  const handleChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        transactionId: "",
        amount: 0,
        status: false,
        courseName: "",
        email: "",
        name: "",
        recordingsId: "12345",
      },
    ]);
  };

  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const validate = () => {
    const newErrors = [];
    let isValid = true;

    courses.forEach((course, index) => {
      const fieldErrors = {};

      if (!course.transactionId.trim()) {
        fieldErrors.transactionId = "Transaction ID is required.";
        isValid = false;
      }
      if (course.amount <= 0) {
        fieldErrors.amount = "Amount must be greater than 0.";
        isValid = false;
      }
      if (!course.courseName.trim()) {
        fieldErrors.courseName = "Course Name is required.";
        isValid = false;
      }
      if (!course.email.trim()) {
        fieldErrors.email = "Email is required.";
        isValid = false;
      }
      if (!course.name.trim()) {
        fieldErrors.name = "Name is required.";
        isValid = false;
      }

      newErrors[index] = fieldErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(
          `http://localhost:4000/update-user/${id}`,
          { courses },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setMessage("Courses updated successfully!");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        }
      } catch (error) {
        setMessage("Failed to update courses.");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    }
  };

  return (
    <div className="p-6 bg-[#030712] h-full overflow-y-scroll m-4 rounded shadow-md">
      <h1 className="text-white text-xl font-bold mb-6">Update Courses</h1>
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          } font-medium`}
        >
          {message}
        </p>
      )}

      {courses.map((course, index) => (
        <div
          key={index}
          className="mb-6 p-4 bg-[#18181b] rounded shadow relative"
        >
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Transaction ID:</label>
            <input
              type="text"
              value={course.transactionId}
              onChange={(e) => handleChange(index, "transactionId", e.target.value)}
              placeholder="Enter Transaction ID"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].transactionId && (
              <p className="text-red-500 text-sm">{errors[index].transactionId}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Amount:</label>
            <input
              type="number"
              value={course.amount}
              onChange={(e) => handleChange(index, "amount", e.target.value)}
              placeholder="Enter Amount"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].amount && (
              <p className="text-red-500 text-sm">{errors[index].amount}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Status:</label>
            <select
              value={course.status}
              onChange={(e) => handleChange(index, "status", e.target.value === "true")}
              className="w-full px-3 py-2 rounded border border-gray-400"
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Course Name:</label>
            <input
              type="text"
              value={course.courseName}
              onChange={(e) => handleChange(index, "courseName", e.target.value)}
              placeholder="Enter Course Name"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].courseName && (
              <p className="text-red-500 text-sm">{errors[index].courseName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Email:</label>
            <input
              type="email"
              value={course.email}
              onChange={(e) => handleChange(index, "email", e.target.value)}
              placeholder="Enter Email"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].email && (
              <p className="text-red-500 text-sm">{errors[index].email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Name:</label>
            <input
              type="text"
              value={course.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="Enter Name"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].name && (
              <p className="text-red-500 text-sm">{errors[index].name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Recordings ID:</label>
            <input
              type="text"
              value={course.recordingsId}
              onChange={(e) => handleChange(index, "recordingsId", e.target.value)}
              placeholder="Enter Recordings ID"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
          </div>

          <button
            onClick={() => handleRemoveCourse(index)}
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded shadow"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button
          onClick={handleAddCourse}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          Add Course
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UpdateInvoice;
