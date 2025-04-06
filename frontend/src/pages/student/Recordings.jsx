import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Recordings() {
  const { id } = useParams();
  const [recordings, setRecordings] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/show-recordings/${id}`
        );
        const { recordings } = response.data;
        setRecordings(recordings);
        if (recordings.length > 0) {
          setSelectedVideo(recordings[0]);
        }
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [id]);

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <div className="flex flex-col md:flex-row justify-around md:sticky md:top-0 h-screen md:h-[100vh] bg-gray-950 max-w-full">
      {/* Video Player Section (Top on Mobile, Left on Desktop) */}
      <div className="w-full  p-1 md:p-5 md:h-[100vh] md:sticky md:top-0 md:w-[70%] ms-0 md:ms-2 md:ms-0 bg-gray-900 order-1 md:order-none">
        {selectedVideo ? (
          <div className="w-full h-[300px] md:h-[500px] border border-[2px] border-[green] rounded-[10px] ">
            <div className="w-full h-full">
              {!iframeError ? (
                <iframe
                  key={selectedVideo.videoUrl}
                  width="100%"
                  height="100%"
                  src={selectedVideo.videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-lg"
                  onError={handleIframeError}
                />
              ) : (
                <div className="text-white">
                  <p className="text-xl">
                    Failed to load the video. Please check the URL.
                  </p>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold hidden md:block my-2 text-white">
              {selectedVideo.videoTitle}
            </h2>
          </div>
        ) : (
          <p className="text-xl text-gray-400 p-4">
            Select a recording to play
          </p>
        )}
      </div>

      {/* Recordings List Section (Below on Mobile, Right on Desktop) */}
      <div className="w-full h-[60vh] mb-10 pb-[40px]  md:p-0 md:w-[300px] md:h-[100vh] bg-gray-950/50 border-t md:border-t-0 md:border-l border-blue-800/30 px-2 md:px-4 sticky top-0 overflow-y-auto order-2 md:order-none">
        <h2 className="text-2xl font-bold text-white pb-2 bg-gray-950 z-[10]">
          Recordings
        </h2>
        {recordings.length > 0 ? (
          <div className="space-y-2 mb-10 pb-[40px]">
            {recordings.map((recording, index) => (
              <div
                key={index}
                className={`p-2 bg-gray-950 hover:cursor-pointer hover:rounded-[5px] ${
                  selectedVideo === recording
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[5px] shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:shadow-lg rounded-[5px]"
                }`}
                onClick={() => {
                  setSelectedVideo(recording);
                  setIframeError(false);
                }}
              >
                <p className="text-sm md:text-base hover:rounded-[5px]">
                  <i className="bi bi-play-circle-fill"></i>{" "}
                  {recording.videoTitle}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No recordings available for this batch.
          </p>
        )}
      </div>
    </div>
  );
}

export default Recordings;
