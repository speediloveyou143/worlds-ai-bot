import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdatePrivacy() {
  const { id } = useParams();
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/show-privacy/${id}`)
      .then((response) => {
        setHeading(response.data.heading);
        setParagraph(response.data.paragraph);
      })
      .catch(() => {
        setError("Failed to fetch privacy details.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !paragraph) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:4000/update-privacy/${id}`,
        { heading, paragraph }
      );
      if (response.status === 200) {
        setSuccess("Privacy entry updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Failed to update privacy entry.");
    }
  };

  return (
    <div className="h-full mt-4 sm:mt-5 m-3 bg-gray-950 flex items-start justify-center">
      <div className="bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Privacy Entry</h2>
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
              Update Privacy Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePrivacy;