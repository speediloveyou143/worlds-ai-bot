import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Recordings() {
  const { id } = useParams(); // `id` is the batch number
  const [recordings, setRecordings] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track the currently selected video

  // Fetch recordings when the component mounts
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/show-recordings/${id}`);
        const { recordings } = response.data; // Extract the recordings array
        setRecordings(recordings);
        // Set the first video as the default selected video
        if (recordings.length > 0) {
          setSelectedVideo(recordings[0]);
        }
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [id]);

  return (
    <div className="flex h-[100%]">
      {/* Left side: List of videos */}
      <div className="w-[40%] h-full bg-black p-2 border-r border-gray-800 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recordings</h2>
        {recordings.length > 0 ? (
          recordings.map((recording, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-lg cursor-pointer ${
                selectedVideo === recording
                  ? "bg-gray-800 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedVideo(recording)}
            >
              <p className="">{recording.videoTitle}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No recordings available for this batch.</p>
        )}
      </div>

      {/* Right side: Video player */}
      <div className="w-full flex justify-center items-center bg-black">
        {selectedVideo ? (
          <div className="w-full max-w-4xl">
            <iframe
              width="890"
              height="555"
              src={selectedVideo.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-lg border border-gray-700"
            ></iframe>
            <h2 className="text-2xl font-bold mb-4 text-white">{selectedVideo.videoTitle}</h2>

          </div>
        ) : (
          <p className="text-xl text-gray-400">Select a recording to play</p>
        )}
      </div>
    </div>
  );
}

export default Recordings;
