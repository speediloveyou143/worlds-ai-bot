import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-contact/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Contact deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the contact.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the contact.");
      console.error("Error deleting contact:", error);
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.offer}</td>
      <td>{props.data.heading}</td>
      <td>{props.data.tag}</td>
      <td>
        <a href={props.data.insta} target="_blank" className="text-blue-500">
          {props.data.insta}
        </a>
      </td>
      <td>
        <a href={props.data.linkedin} target="_blank" className="text-blue-500">
          {props.data.linkedin}
        </a>
      </td>
      <td>
        <a href={props.data.youtube} target="_blank" className="text-blue-500">
          {props.data.youtube}
        </a>
      </td>
      <td>{props.data.channel}</td>
      <td>
        <a href={props.data.maps} target="_blank" className="text-blue-500">
          {props.data.maps}
        </a>
      </td>
      <td>
        <a href={props.data.group} target="_blank" className="text-blue-500">
          {props.data.group}
        </a>
      </td>
      <td>{props.data.email}</td>
      <td>{props.data.number}</td>
      <td>{props.data.address}</td>
      <td>
        <img
          src={props.data.logo}
          alt="Contact Logo"
          className="w-16 h-16 object-contain"
        />
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-create-data/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllData() {
  const [contactData, setContactData] = useState([]);

  async function fetchContacts() {
    try {
      const response = await axios.get("http://localhost:4000/all-contacts", {
        withCredentials: true,
      });
      setContactData(response?.data);
    } catch (err) {
      setContactData([]);
      console.error("Error fetching contacts:", err);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th>#</th>
            <td>Offer</td>
            <td>Heading</td>
            <td>Tag</td>
            <td>Instagram</td>
            <td>LinkedIn</td>
            <td>YouTube</td>
            <td>Channel</td>
            <td>Maps</td>
            <td>Group</td>
            <td>Email</td>
            <td>Phone Number</td>
            <td>Address</td>
            <td>Logo</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contactData.length > 0 ? (
            contactData.map((x, index) => (
              <Row key={index} number={index + 1} data={x} />
            ))
          ) : (
            <tr>
              <td colSpan="16" className="text-center">
                No contacts found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Offer</td>
            <td>Heading</td>
            <td>Tag</td>
            <td>Instagram</td>
            <td>LinkedIn</td>
            <td>YouTube</td>
            <td>Channel</td>
            <td>Maps</td>
            <td>Group</td>
            <td>Email</td>
            <td>Phone Number</td>
            <td>Address</td>
            <td>Logo</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllData;