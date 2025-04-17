import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        const response = await axios.delete(
          `${BACKEND_URL}/delete-register/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("User deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the user.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  }

  return (
    <>
      <tr>
        <th>{props.number}</th>
        <td>{props.data.name}</td>
        <td>{props.data.email}</td>
        <td>{props.data.mobile}</td>
        <td>{props.data.country}</td>
        <td>{props.data.state}</td>
        <td>{props.data.course}</td>
        <td className="text-error cursor-pointer" onClick={handleDelete}>
          Delete
        </td>
      </tr>
    </>
  );
}

function AllRegisters() {
  const [userData, setUserData] = useState([]);

  async function fetchUsers() {
    try {
      const response = await axios.get(`${BACKEND_URL}/all-registers`, {
        withCredentials: true,
      });
      setUserData(response.data);
    } catch (err) {
      alert("Something went wrong while fetching users.");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll pb-[80px] sm:pb-[0px]">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Country</th>
            <th>State</th>
            <th>Course</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <Row key={user._id} number={index + 1} data={user} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Country</th>
            <th>State</th>
            <th>Course</th>
            <th>Delete</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllRegisters;