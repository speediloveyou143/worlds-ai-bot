import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreateCourseValidate } from "../../utils/createCourseValidate";
import axios from "axios";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    imageUrl: "",
    price: "",
    duration: "",
    enrolled: "",
    status: "0",
    badge: "trending",
    hours: "",
    nextId: "",
    recordingId: "",
  });

  const [formError, setFormError] = useState("");

  async function courseData() {
    try {
      const response = await axios.get(
        `http://localhost:4000/show-course/${id}`,
        { withCredentials: true }
      );
      const data = response.data;

      if (data) {
        setFormData({
          courseName: data.courseName || "",
          imageUrl: data.imageUrl || "",
          price: data.price || "",
          duration: data.duration || "",
          enrolled: data.enrolled || "",
          status: data.status || "0",
          badge: data.badge || "trending",
          hours: data.hours || "",
          nextId: data.nextId || "",
          recordingId: data.recordingId || "",
        });
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      setFormError("Failed to load course data.");
    }
  }

  useEffect(() => {
    courseData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const validationError = CreateCourseValidate(
        formData.courseName,
        formData.imageUrl,
        formData.price,
        formData.duration,
        formData.enrolled,
        formData.status,
        formData.badge,
        formData.hours,
        formData.nextId,
        formData.recordingId
      );
      if (validationError) {
        setFormError(validationError);
        return;
      }

      setFormError("");

      const updatedCourseData = { ...formData };
      const response = await axios.patch(
        `http://localhost:4000/update-course/${id}`,
        updatedCourseData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Course updated successfully!");
        navigate("/admin-dashboard/profile/all-courses");
      } else {
        setFormError("Failed to update course.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-base-300 p-4 sm:p-7 rounded-2xl border-2 border-sky-500 text-center h-full overflow-y-auto">
      <h1 className="text-2xl sm:text-4xl mb-4">Update Course</h1>
      
      <div className="space-y-3">
        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Course Name:</span>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Image Url:</span>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Price:</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Duration:</span>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Enrolled:</span>
          <input
            type="number"
            name="enrolled"
            value={formData.enrolled}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Status:</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="grow"
          >
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Badge:</span>
          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="grow"
          >
            <option value="trending">Trending</option>
            <option value="best-seller">Best Seller</option>
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Hours:</span>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Custom Course ID:</span>
          <input
            type="text"
            name="nextId"
            value={formData.nextId}
            onChange={handleChange}
            className="grow"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <span className="w-28 sm:w-32 text-left">Recording ID:</span>
          <input
            type="text"
            name="recordingId"
            value={formData.recordingId}
            onChange={handleChange}
            className="grow"
          />
        </label>
      </div>

      <p className="text-error mt-3">{formError}</p>
      <button onClick={handleSubmit} className="btn w-full mt-4 btn-info">
        Update Course
      </button>
    </div>
  );
}

export default UpdateCourse;