import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateRecordings() {
  const { id } = useParams(); // Batch ID from URL params
  const [batch, setBatch] = useState({
    batchNumber: "",
    videos: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Fetch batch data when component mounts
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/show-recordings/${id}`,
          { withCredentials: true }
        );

        // Log the entire response to check the structure

        if (response.status === 200) {
          const { batchNumber, recordings } = response.data;

          // Check if recordings is available and properly formatted
          if (recordings && Array.isArray(recordings)) {
            const formattedVideos = recordings.map((recording) => ({
              videoUrl: recording.videoUrl || "", // Change from videoUrl to url
              videoTitle: recording.videoTitle || "", // Change from videoTitle to title
            }));


            setBatch({
              batchNumber: batchNumber || "",
              videos: formattedVideos,
            });
          } else {
            setMessage("No recordings found.");
          }
        }
      } catch (error) {
        setMessage("Failed to load batch data.");
      }
    };

    fetchBatchData();
  }, [id]);

  // Handle input changes
  const handleBatchNumberChange = (e) => {
    setBatch({ ...batch, batchNumber: e.target.value });
  };

  const handleVideoUrlChange = (index, value) => {
    const updatedVideos = [...batch.videos];
    updatedVideos[index].videoUrl = value;
    setBatch({ ...batch, videos: updatedVideos });
  };

  const handleVideoTitleChange = (index, value) => {
    const updatedVideos = [...batch.videos];
    updatedVideos[index].videoTitle = value;
    setBatch({ ...batch, videos: updatedVideos });
  };

  const removeVideo = (index) => {
    const updatedVideos = batch.videos.filter((_, i) => i !== index);
    setBatch({ ...batch, videos: updatedVideos });
  };

  // Add a new video
  const addVideo = () => {
    const updatedVideos = [...batch.videos, { videoUrl: "", videoTitle: "" }];
    setBatch({ ...batch, videos: updatedVideos });
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!batch.batchNumber) {
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

  // Handle form submission to update recordings
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(
          `http://localhost:4000/update-recordings/${id}`,
          { batchNumber: batch.batchNumber, recordings: batch.videos },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setMessage("Recordings updated successfully!");
        }
      } catch (error) {
        setMessage("Failed to update recordings. Please try again.");
      }
    }
  };

  return (
    <div className="sm:p-6 p-0 sm:pb-0 pb-[120px] bg-[#030712] h-full overflow-y-scroll m-4 rounded shadow-md">
      <h1 className="text-white text-xl font-bold mb-6">Update Recordings</h1>
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          } font-medium`}
        >
          {message}
        </p>
      )}

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
              value={video.videoUrl} // Ensure this is 'videoUrl'
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
              value={video.videoTitle} // Ensure this is 'videoTitle'
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

      <div className="mt-4">
        <button
          type="button"
          onClick={addVideo}
          className="px-5 py-2 bg-green-500 text-black rounded hover:bg-green-600"
        >
          Add Video
        </button>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          onClick={handleUpdate}
          className="px-5 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Update Recordings
        </button>
      </div>
    </div>
  );
}

export default UpdateRecordings;
