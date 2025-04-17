// components/UpdateJob.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function UpdateJob() {
  const { id } = useParams();
  const [experience, setExperience] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [workType, setWorkType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/show-job/${id}`, { withCredentials: true })
      .then((response) => {
        setExperience(response.data.experience);
        setJobRole(response.data.jobRole);
        setWorkType(response.data.workType);
      })
      .catch(() => {
        setError("Failed to fetch job details.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!experience || !jobRole || !workType) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/update-job/${id}`,
        { experience, jobRole, workType },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccess("Job updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Failed to update job.");
    }
  };

  return (
    <div className="h-full bg-gray-950 flex items-start justify-center m-3">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Job</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="experience">
              Experience
            </label>
            <input
              type="text"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter experience (e.g., 2-5 years)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="jobRole">
              Job Role
            </label>
            <input
              type="text"
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter job role"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="workType">
              Work Type
            </label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            >
              <option value="">Select work type</option>
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateJob;