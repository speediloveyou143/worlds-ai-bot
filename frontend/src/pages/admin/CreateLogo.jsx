import React, { useState } from 'react';
import axios from 'axios';

function CreateLogo() {
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!logo.trim()) newErrors.logo = 'Logo URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:4000/create-logo', { companyName, logo });
      if (response.status === 200) {
        setMessage({ text: 'Company logo created successfully!', type: 'success' });
        setCompanyName('');
        setLogo('');
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="bg-gray-950 sm:flex sm:items-center sm:justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Company Logo</h2>

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
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="logo">
              Logo URL
            </label>
            <input
              type="text"
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.logo
                  ? 'border-red-500 focus:ring-red-500 bg-gray-700 text-white'
                  : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
              }`}
              placeholder="Enter logo URL"
            />
            {errors.logo && (
              <p className="text-red-400 text-sm mt-1">{errors.logo}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            
            Create Logo
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateLogo;