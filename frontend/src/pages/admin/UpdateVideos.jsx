import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function UpdateVideos() {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [name, setName] = useState("");
  const [packageAmount, setPackageAmount] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/show-video/${id}`, { withCredentials: true })
      .then((response) => {
        setVideoUrl(response.data.videoUrl);
        setJobRole(response.data.jobRole);
        setName(response.data.name);
        setPackageAmount(response.data.package);
        setCompanyName(response.data.companyName);
      })
      .catch(() => {
        setError("Failed to fetch video details.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl || !jobRole || !name || !packageAmount || !companyName) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/update-video/${id}`,
        { videoUrl, jobRole, name, package: packageAmount, companyName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccess("Video updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Failed to update video.");
    }
  };

  return (
    <div className="h-full flex items-start justify-center mt-4 m-3 sm:p-3 p-2 bg-gray-950">
      <div className="bg-gray-800 p-3 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Success Video</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="videoUrl">
              Video URL
            </label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter video URL"
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
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="package">
              Package
            </label>
            <input
              type="text"
              id="package"
              value={packageAmount}
              onChange={(e) => setPackageAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter package"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="companyName">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter company name"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateVideos;