// components/CreateJob.js
import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../../../config/constant";

function CreateJob() {
  const [experience, setExperience] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [workType, setWorkType] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!experience.trim()) newErrors.experience = 'Experience is required';
    if (!jobRole.trim()) newErrors.jobRole = 'Job Role is required';
    if (!workType) newErrors.workType = 'Work Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/create-job`, { experience, jobRole, workType });
      if (response.status === 200){
        setMessage({ text: 'Job created successfully!', type: 'success' });
        setExperience('');
        setJobRole('');
        setWorkType('');
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="h-full bg-gray-950 sm:flex items-start sm:justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Job</h2>

        {message.text && (
          <div
            className={`p-3 mb-4 rounded-lg text-center ${
              message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="experience">
              Experience
            </label>
            <input
              type="text"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.experience
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter experience (e.g., 2-5 years)"
            />
            {errors.experience && (
              <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="jobRole">
              Job Role
            </label>
            <input
              type="text"
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.jobRole
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter job role"
            />
            {errors.jobRole && (
              <p className="text-red-400 text-sm mt-1">{errors.jobRole}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="workType">
              Work Type
            </label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.workType
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
            >
              <option value="">Select work type</option>
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.workType && (
              <p className="text-red-400 text-sm mt-1">{errors.workType}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;