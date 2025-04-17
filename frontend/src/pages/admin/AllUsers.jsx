
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function Row(props) {
  const navigate=useNavigate()
  async function handleDelete() {
    try {
      if (window.confirm("are you sure you want to delete this record?")) {
        const response = await axios.delete(
          `${BACKEND_URL}/delete-profile/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("User deleted successfully!");
          navigate("/admin-dashboard/profile/all-users")
        } else {
          alert("Failed to delete the user.");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  }

  const isPaid = props.data.courses?.length > 1;
  const paidStatus = isPaid ? "Paid" : "Not Paid";
  const statusClass = isPaid ? "text-green-500" : "text-red-500";

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.name}</td>
      <td>{props.data.email}</td>
      <td>{props.data.number}</td>
      <td>{props.data.batchNumber}</td>
      <td className={statusClass}>{paidStatus}</td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-pc/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-ic/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-cc/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-invoice/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-user/${props.data._id}`}>
          update
        </Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllUsers() {
  const [userData, setUserData] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [paidFilter, setPaidFilter] = useState("All");

  async function users() {
    try {
      const response = await axios.get(`${BACKEND_URL}/show-profiles`, {
        withCredentials: true,
      });
      setUserData(response?.data?.data);
    } catch (err) {
      alert("Something went wrong while fetching users");
    }
  }

  useEffect(() => {
    users();
  }, []);

  const filteredUsers = userData.filter((user) => {
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    const isPaid = user.courses?.length > 1;
    const matchesPaid =
      paidFilter === "All" ||
      (paidFilter === "Paid" && isPaid) ||
      (paidFilter === "Not Paid" && !isPaid);
    return matchesEmail && matchesPaid;
  });

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-auto pb-[80px] md:pb-0">
      {/* Filter Buttons and Search Bar */}
      <div className="m-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by email..."
            className="input input-bordered w-full pl-10 pr-4 py-2 shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-row space-x-2 mt-3 md:mt-0 justify-center md:justify-end">
          <button
            className={`btn btn-sm w-[80px] md:w-auto ${
              paidFilter === "All" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setPaidFilter("All")}
          >
            All
          </button>
          <button
            className={`btn btn-sm w-[80px] md:w-auto ${
              paidFilter === "Paid" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setPaidFilter("Paid")}
          >
            Paid
          </button>
          <button
            className={`btn btn-sm w-[80px] md:w-auto ${
              paidFilter === "Not Paid" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setPaidFilter("Not Paid")}
          >
            Not Paid
          </button>
        </div>
      </div>

      <table className="table table-xs table-pin-rows table-pin-cols w-full">
        <thead>
          <tr>
            <th>#</th>
            <td>Name</td>
            <td>Email</td>
            <td>Number</td>
            <td>B-Number</td>
            <td>Paid Status</td>
            <td>P-c</td>
            <td>I-c</td>
            <td>C-c</td>
            <td>Invoice</td>
            <td>Update</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((x, index) => (
            <Row key={x._id} number={index + 1} data={x} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>#</th>
            <td>Name</td>
            <td>Email</td>
            <td>Number</td>
            <td>B-Number</td>
            <td>Paid Status</td>
            <td>P-c</td>
            <td>I-c</td>
            <td>C-c</td>
            <td>Invoice</td>
            <td>Update</td>
            <td>Delete</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllUsers;