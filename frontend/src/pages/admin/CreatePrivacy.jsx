
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../config/constant";


function CreatePrivacy() {
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !paragraph) {
      setError("Heading and paragraph are required.");
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/create-privacy`, {
        heading,
        paragraph,
      },{withCredentials:true});
      if (response.status === 200) {
        setSuccess("Privacy entry created successfully!");
        setError("");
        setHeading("");
        setParagraph("");
      }
    } catch (err) {
      setError("Failed to create privacy entry.");
    }
  };

  return (
    <div className="h-full mt-4 sm:mt-5 m-3 bg-gray-950 flex items-start  justify-center ">
      <div className="bg-gray-800 sm:p-8 p-3 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Privacy Entry</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="heading">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter heading"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="paragraph">
              Paragraph
            </label>
            <textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter paragraph"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Create Privacy Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePrivacy;