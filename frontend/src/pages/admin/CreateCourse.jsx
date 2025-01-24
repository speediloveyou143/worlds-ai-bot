import React, { useState } from "react";
import { CreateCourseValidate } from "../../utils/createCourseValidate";
import axios from "axios";

function CreateCourse() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const result = CreateCourseValidate(
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
      if (result) {
        setFormError(result);
        return;
      } else {
        setFormError("");
        const course = {
          ...formData,
        };
        const response = await axios.post(
          "http://localhost:4000/create-course",
          course,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Course created successfully!");
          setFormError("");
        } else {
          setFormError("Course not created.");
        }
      }
    } catch (err) {
      setFormError("Something went wrong.");
    }
  };

  return (
    <div className="w-2/3 bg-base-300 p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
      <h1 className="text-4xl">Create Course</h1>
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
          <option value="0">0</option>
          <option value="1">1</option>
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
        Create Course
      </button>
    </div>
  );
}

export default CreateCourse;
