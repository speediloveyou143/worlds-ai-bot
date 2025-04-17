import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";


function Row(props) {
  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this company?")) {
        const response = await axios.delete(
          `${BACKEND_URL}/delete-company/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Company deleted successfully!");
          window.location.reload();
        } else {
          alert("Failed to delete the company.");
        }
      }
    } catch (error) {
      alert("An error occurred while deleting the company.");
    }
  }

  return (
    <tr>
      <th>{props.number}</th>
      <td>{props.data.companyName}</td>
      <td>
        <img src={props.data.logo} alt={props.data.companyName} className="w-16 h-16 object-contain" />
      </td>
      <td className="text-success cursor-pointer">
        <Link to={`/admin-dashboard/profile/update-company/${props.data._id}`}>update</Link>
      </td>
      <td className="text-error cursor-pointer" onClick={handleDelete}>
        delete
      </td>
    </tr>
  );
}

function AllCompanyLogos() {
  const [companyData, setCompanyData] = useState([]);

  async function fetchCompanies() {
    try {
      const response = await axios.get(`${BACKEND_URL}/show-companies`, {
        withCredentials: true,
      });
      setCompanyData(response?.data);
    } catch (err) {
      setCompanyData([]);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-scroll pb-[82px] sm:pb-[0px]">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Company Name</td>
            <td>Logo</td>
            <td>Update</td>
            <td>Delete</td>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {companyData.length > 0 ? (
            companyData.map((x, index) => {
              return <Row key={index} number={index + 1} data={x} />;
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No logos found.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Company Name</td>
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

export default AllCompanyLogos;