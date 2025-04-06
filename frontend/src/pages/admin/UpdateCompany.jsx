import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateCompany() {
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/show-company/${id}`, { withCredentials: true })
      .then((response) => {
        setCompanyName(response.data.companyName);
        setLogo(response.data.logo);
      })
      .catch(() => {
        setError("Failed to fetch company details.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !logo) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:4000/update-company/${id}`,
        { companyName, logo },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccess("Company updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Failed to update company.");
    }
  };

  return (
    <div className="h-full flex items-start mt-4 m-3 justify-center bg-gray-950">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Company</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="companyName">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter company name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="logo">
              Logo URL
            </label>
            <input
              type="text"
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter logo URL"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCompany;