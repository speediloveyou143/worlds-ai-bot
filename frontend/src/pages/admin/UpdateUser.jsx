
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

const UpdateUser = () => {
  const { id } = useParams(); // Get the user ID from the URL parameters
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    role: "student",
    batchNumber: 10,
    paymentStatus: false,
    university: "worldsaibot",
  });
  const [loading, setLoading] = useState(true); // For loading state
  const [message, setMessage] = useState(""); // Success or error message

  // Fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/show-user/${id}`,{withCredentials:true}); // Fetch user data by ID
        const userData = response.data;

        // Update the form data with the fetched data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          number: userData.number || "",
          role: userData.role || "student",
          batchNumber: userData.batchNumber || 10,
          paymentStatus: userData.paymentStatus || false,
          university: userData.university || "worldsaibot",
        });

        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        alert("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" && value === "" ? "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure no input field is empty
    for (const key in formData) {
      if (formData[key] === "" || formData[key] === null) {
        setMessage("Please fill out all fields.");
        setTimeout(() => setMessage(""), 3000); // Clear the message after 3 seconds
        return;
      }
    }

    try {
      await axios.put(`${BACKEND_URL}/update-user/${id}`, formData,{withCredentials:true}); // Update user data
      setMessage("Profile updated successfully!"); // Show success message
    } catch (error) {
      console.error("Error updating user:", error.message);
      setMessage("Failed to update profile."); // Show error message
    }

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading user data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-black shadow-md rounded-lg p-6 h-full overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-4 text-white">Update User</h2>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-4 text-center py-2 px-4 rounded ${
            message.includes("successfully") ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-white font-medium mb-2">
            Number
          </label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter number"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-white font-medium mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="batchNumber" className="block text-white font-medium mb-2">
            Batch Number
          </label>
          <input
            type="number"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter batch number"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentStatus" className="block text-white font-medium mb-2">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus.toString()} // Convert boolean to string for dropdown
            onChange={(e) =>
              setFormData({ ...formData, paymentStatus: e.target.value === "true" })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="university" className="block text-white font-medium mb-2">
            University
          </label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter university"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
