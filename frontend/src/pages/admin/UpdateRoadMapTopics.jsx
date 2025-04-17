import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function UpdateRoadMapTopics() {
  const { id } = useParams();
  const [roadMapName, setRoadMapName] = useState("");
  const [roadMapId, setRoadMapId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/show-roadmap-topic/${id}`, { withCredentials: true })
      .then((response) => {
        setRoadMapName(response.data.roadMapName);
        setRoadMapId(response.data.id);
      })
      .catch(() => {
        setError("Failed to fetch roadmap topic details.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roadMapName || !roadMapId) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/update-roadmap-topic/${id}`,
        { roadMapName, id: roadMapId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccess("Roadmap topic updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Failed to update roadmap topic.");
    }
  };

  return (
    <div className="h-full bg-gray-950 flex items-start justify-center m-3">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Roadmap Topic</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="roadMapName">
              Roadmap Name
            </label>
            <input
              type="text"
              id="roadMapName"
              value={roadMapName}
              onChange={(e) => setRoadMapName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter roadmap name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="roadMapId">
              ID
            </label>
            <input
              type="text"
              id="roadMapId"
              value={roadMapId}
              onChange={(e) => setRoadMapId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter roadmap ID"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Roadmap Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRoadMapTopics;