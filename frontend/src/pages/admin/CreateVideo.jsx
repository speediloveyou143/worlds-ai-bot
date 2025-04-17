import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../../../config/constant";

function CreateVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [name, setName] = useState('');
  const [packageAmount, setPackageAmount] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!videoUrl.trim()) newErrors.videoUrl = 'Video URL is required';
    if (!jobRole.trim()) newErrors.jobRole = 'Job Role is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!packageAmount.trim()) newErrors.packageAmount = 'Package is required';
    if (!companyName.trim()) newErrors.companyName = 'Company Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/create-video`, {
        videoUrl,
        jobRole,
        name,
        package: packageAmount,
        companyName,
      });
      if (response.status === 200) {
        setMessage({ text: 'Success video created successfully!', type: 'success' });
        setVideoUrl('');
        setJobRole('');
        setName('');
        setPackageAmount('');
        setCompanyName('');
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="h-full bg-gray-950 p-2 sm:flex sm:items-center sm:justify-center ">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Success Video</h2>

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
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="videoUrl">
              Video URL
            </label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.videoUrl
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter video URL"
            />
            {errors.videoUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.videoUrl}</p>
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

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="package">
              Package
            </label>
            <input
              type="text"
              id="package"
              value={packageAmount}
              onChange={(e) => setPackageAmount(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.packageAmount
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter package"
            />
            {errors.packageAmount && (
              <p className="text-red-400 text-sm mt-1">{errors.packageAmount}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="companyName">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyName
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Success Video
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateVideo;