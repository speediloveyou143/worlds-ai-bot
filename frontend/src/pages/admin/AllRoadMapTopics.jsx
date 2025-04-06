
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this roadmap topic?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-roadmap-topic/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Roadmap topic deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the roadmap topic.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the roadmap topic.");
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.roadMapName}</td>
      <td>{props.data.id}</td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-road-map-topics/${props.data._id}`}>update</Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllRoadMapTopics() {
  const [roadMapData, setRoadMapData] = useState([]);

  async function fetchRoadMapTopics() {
    try {
      const response = await axios.get("http://localhost:4000/show-roadmap-topic", {
        withCredentials: true,
      });
      setRoadMapData(response?.data);
    } catch (err) {
      setRoadMapData([]);
    }
  }

  useEffect(() => {
    fetchRoadMapTopics();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Roadmap Name</td>
            <td>ID</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {roadMapData.length > 0 ? (
            roadMapData.map((x, index) => {
              return <Row key={index} number={index + 1} data={x} />;
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No roadmap topics found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Roadmap Name</td>
            <td>ID</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllRoadMapTopics;