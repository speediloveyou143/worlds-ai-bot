import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function VideoRow(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this video?")) {
        const response = await axios.delete(
          `${BACKEND_URL}/delete-video/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Video deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the video.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the video.");
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.videoUrl}</td>
      <td>{props.data.jobRole}</td>
      <td>{props.data.name}</td>
      <td>{props.data.package}</td>
      <td>{props.data.companyName}</td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-video/${props.data._id}`}>update</Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllVideos() {
  const [videoData, setVideoData] = useState([]);

  async function fetchVideos() {
    try {
      const response = await axios.get(`${BACKEND_URL}/show-videos`, {
        withCredentials: true,
      });
      setVideoData(response?.data);
    } catch (err) {
      setVideoData([]);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Video URL</td>
            <td>Job Role</td>
            <td>Name</td>
            <td>Package</td>
            <td>Company Name</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {videoData.length > 0 ? (
            videoData.map((x, index) => {
              return <VideoRow key={index} number={index + 1} data={x} />;
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No videos found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Video URL</td>
            <td>Job Role</td>
            <td>Name</td>
            <td>Package</td>
            <td>Company Name</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllVideos;