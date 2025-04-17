import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../../../config/constant";

function CreateRoadMapTopics() {
  const [roadMapName, setRoadMapName] = useState('');
  const [id, setId] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!roadMapName.trim()) newErrors.roadMapName = 'Roadmap Name is required';
    if (!id.trim()) newErrors.id = 'ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/create-roadmap-topic`, { roadMapName, id });
      if (response.status === 200) {
        setMessage({ text: 'Roadmap topic created successfully!', type: 'success' });
        setRoadMapName('');
        setId('');
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="h-full bg-gray-950 sm:flex items-start sm:justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Roadmap Topic</h2>

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
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="roadMapName">
              Roadmap Name
            </label>
            <input
              type="text"
              id="roadMapName"
              value={roadMapName}
              onChange={(e) => setRoadMapName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.roadMapName
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter roadmap name"
            />
            {errors.roadMapName && (
              <p className="text-red-400 text-sm mt-1">{errors.roadMapName}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="id">
              ID
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.id
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter roadmap ID"
            />
            {errors.id && (
              <p className="text-red-400 text-sm mt-1">{errors.id}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Roadmap Topic
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoadMapTopics;