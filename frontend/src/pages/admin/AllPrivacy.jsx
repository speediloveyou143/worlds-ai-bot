import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this privacy entry?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-privacy/${props.data._id}`
        );
        if (response.status === 200) {
          alert("Privacy entry deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the privacy entry.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the privacy entry.");
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.heading}</td>
      <td>{props.data.paragraph}</td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-privacy/${props.data._id}`}>update</Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllPrivacy() {
  const [privacyData, setPrivacyData] = useState([]);

  async function fetchPrivacies() {
    try {
      const response = await axios.get("http://localhost:4000/show-privacies");
      setPrivacyData(response?.data);
    } catch (err) {
      setPrivacyData([]);
    }
  }

  useEffect(() => {
    fetchPrivacies();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Heading</td>
            <td>Paragraph</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {privacyData.length > 0 ? (
            privacyData.map((x, index) => {
              return <Row key={index} number={index + 1} data={x} />;
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No privacy entries found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Heading</td>
            <td>Paragraph</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllPrivacy;