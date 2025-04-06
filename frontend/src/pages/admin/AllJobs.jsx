// components/AllJobs.js
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this job?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-job/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Job deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the job.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the job.");
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.experience}</td>
      <td>{props.data.jobRole}</td>
      <td>{props.data.workType}</td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-job/${props.data._id}`}>update</Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllJobs() {
  const [jobData, setJobData] = useState([]);

  async function fetchJobs() {
    try {
      const response = await axios.get("http://localhost:4000/show-jobs", {
        withCredentials: true,
      });
      setJobData(response?.data);
    } catch (err) {
      setJobData([]);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Experience</td>
            <td>Job Role</td>
            <td>Work Type</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobData.length > 0 ? (
            jobData.map((x, index) => {
              return <Row key={index} number={index + 1} data={x} />;
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No jobs found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Experience</td>
            <td>Job Role</td>
            <td>Work Type</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllJobs;