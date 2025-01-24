import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("are you sure you want to delete this record?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-profile/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("User deleted successfully!");
          window.location.reload()
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
        <td>{props.data.number}</td>
        <td>{props.data.batchNumber}</td>
        <td className="text-success cursor-pointer"><Link to={"/admin-dashboard/profile/update-pc/"+props.data._id} >update</Link></td>
        <td className="text-success cursor-pointer"><Link to={"/admin-dashboard/profile/update-ic/"+props.data._id}>update</Link></td>
        <td className="text-success cursor-pointer"><Link to={"/admin-dashboard/profile/update-cc/"+props.data._id}>update</Link></td>
        <td className="text-success cursor-pointer"><Link to={"/admin-dashboard/profile/update-invoice/"+props.data._id}>update</Link></td>
        <Link to={"/admin-dashboard/profile/update-user/"+props.data._id}><th className=" text-success cursor-pointer">update</th></Link>
        <th className=" text-error cursor-pointer" onClick={handleDelete}>
          delete
        </th>
      </tr>
    </>
  );
}
function AllUsers() {
  const [userData, setUserData] = useState([]);

  async function users() {
    try {
      const response = await axios.get("http://localhost:4000/show-profiles", {
        withCredentials: true,
      });
      console.log("allusers", response.data.data);
      setUserData(response?.data?.data);
    } catch (err) {
      alert("something went wrong while showing user");
    }
  }
  useEffect(() => {
    users();
  }, []);
  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Name</td>
            <td>Email</td>
            <td>Number</td>
            <td>B-Number</td>
            <td>P-c</td>
            <td>I-c</td>
            <td>C-c</td>
            <td>Invoice</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userData.map((x, index) => {
            return <Row key={index} number={index + 1} data={x} />;
          })}
        </tbody>
        <tfoot>
          <tr>
            <th></th>

            <td>Name</td>
            <td>Email</td>
            <td>Number</td>
            <td>B-Number</td>
            <td>P-c</td>
            <td>I-c</td>
            <td>C-c</td>
            <td>Invoice</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default AllUsers;
