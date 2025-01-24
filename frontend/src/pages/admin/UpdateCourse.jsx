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
    recordingId: "", // Added recordingId field
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
          recordingId: data.recordingId || "", // Set recordingId from the API response
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
    <div className="w-2/3 bg-base-300 p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
      <h1 className="text-4xl">Update Course</h1>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Course Name:
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Image Url:
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Duration:
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Enrolled:
        <input
          type="number"
          name="enrolled"
          value={formData.enrolled}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Status:
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
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Badge:
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
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Hours:
        <input
          type="number"
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Custom Course ID:
        <input
          type="text"
          name="nextId"
          value={formData.nextId}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Recording ID:
        <input
          type="text"
          name="recordingId"
          value={formData.recordingId}
          onChange={handleChange}
          className="grow"
        />
      </label>
      <p className="text-error">{formError}</p>
      <button onClick={handleSubmit} className="btn w-full mt-3 btn-info">
        Update Course
      </button>
    </div>
  );
}

export default UpdateCourse;
