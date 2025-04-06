import React, { useState } from "react";
import axios from "axios";

function CreateRecordings() {
  const [batch, setBatch] = useState({
    batchNumber: "",
    videos: [
      {
        videoUrl: "",
        videoTitle: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Handle batch number change
  const handleBatchNumberChange = (e) => {
    setBatch({ ...batch, batchNumber: e.target.value });
  };

  // Handle video URL change
  const handleVideoUrlChange = (index, value) => {
    const updatedVideos = [...batch.videos];
    updatedVideos[index].videoUrl = value;
    setBatch({ ...batch, videos: updatedVideos });
  };

  // Handle video title change
  const handleVideoTitleChange = (index, value) => {
    const updatedVideos = [...batch.videos];
    updatedVideos[index].videoTitle = value;
    setBatch({ ...batch, videos: updatedVideos });
  };

  // Add a new video URL and title input
  const addVideo = () => {
    setBatch({
      ...batch,
      videos: [...batch.videos, { videoUrl: "", videoTitle: "" }],
    });
  };

  // Remove a video URL and title input
  const removeVideo = (index) => {
    const updatedVideos = batch.videos.filter((_, i) => i !== index);
    setBatch({ ...batch, videos: updatedVideos });
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!batch.batchNumber.trim()) {
      newErrors.batchNumber = "Batch number is required.";
    }

    batch.videos.forEach((video, index) => {
      if (!video.videoUrl.trim()) {
        newErrors[`videoUrl-${index}`] = "Video URL is required.";
      }
      if (!video.videoTitle.trim()) {
        newErrors[`videoTitle-${index}`] = "Video title is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Batch Data:", batch); // Log the full batch data to verify

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:4000/create-recordings",
          {
            batchNumber: batch.batchNumber,
            recordings: batch.videos.map((video) => ({
              videoUrl: video.videoUrl,
              videoTitle: video.videoTitle,
            })), // Ensure correct structure
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Recordings added successfully!");
          setBatch({
            batchNumber: "",
            videos: [
              {
                videoUrl: "",
                videoTitle: "",
              },
            ],
          });
          setErrors({});
        }
      } catch (error) {
        console.error("Error adding recordings:", error);
        setMessage("Failed to add recordings. Please try again.");
      }
    }
  };

  return (
    <div className="sm:p-6 p-0 sm:pb-0 pb-[120px] bg-[#030712] h-full overflow-y-scroll m-4 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-white font-medium mb-2">
          Batch Number:
        </label>
        <input
          type="number"
          value={batch.batchNumber}
          onChange={handleBatchNumberChange}
          placeholder="Enter batch number"
          className="w-full px-3 py-2 rounded border border-gray-400"
        />
        {errors.batchNumber && (
          <p className="text-red-500 text-sm">{errors.batchNumber}</p>
        )}
      </div>

      {batch.videos.map((video, index) => (
        <div key={index} className="mb-6 p-4 bg-[#18181b] rounded shadow relative">
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">
              Video URL:
            </label>
            <input
              type="text"
              value={video.videoUrl}
              onChange={(e) => handleVideoUrlChange(index, e.target.value)}
              placeholder="Enter video URL"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[`videoUrl-${index}`] && (
              <p className="text-red-500 text-sm">{errors[`videoUrl-${index}`]}</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Video Title:
            </label>
            <input
              type="text"
              value={video.videoTitle}
              onChange={(e) => handleVideoTitleChange(index, e.target.value)}
              placeholder="Enter video title"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[`videoTitle-${index}`] && (
              <p className="text-red-500 text-sm">{errors[`videoTitle-${index}`]}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeVideo(index)}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addVideo}
        className="mt-4 px-4 py-2 bg-green-700 text-black font-bold rounded hover:bg-green-800"
      >
        + Add Video
      </button>

      <div className="mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          } font-medium`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CreateRecordings;
