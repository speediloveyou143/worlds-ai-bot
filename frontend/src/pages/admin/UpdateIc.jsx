

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

const UpdateIc = ({ apiUrl }) => {
  const { id } = useParams();
  const [iCertificates, setICertificates] = useState([
    { name: "", status: false, startDate: "", endDate: "", courseName: "" },
  ]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/show-user/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const certificates = response.data.iCertificates || [];
          if (certificates.length === 0) {
            setICertificates([{ name: "", status: false, startDate: "", endDate: "", courseName: "" }]);
          } else {
            setICertificates(certificates);
          }
        }
      } catch (error) {
        setMessage("Failed to fetch certificates.");
      }
    };
    fetchCertificates();
  }, [id, apiUrl]);

  const handleChange = (index, field, value) => {
    const updatedCertificates = [...iCertificates];
    updatedCertificates[index][field] = value;
    setICertificates(updatedCertificates);
  };

  const handleAddCertificate = () => {
    setICertificates([
      ...iCertificates,
      { name: "", status: false, startDate: "", endDate: "", courseName: "" },
    ]);
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertificates = iCertificates.filter((_, i) => i !== index);
    setICertificates(updatedCertificates);
  };

  const validate = () => {
    const newErrors = [];
    let isValid = true;

    iCertificates.forEach((certificate, index) => {
      const fieldErrors = {};

      if (!certificate.name.trim()) {
        fieldErrors.name = "Name is required.";
        isValid = false;
      }
      if (!certificate.startDate.trim()) {
        fieldErrors.startDate = "Start Date is required.";
        isValid = false;
      }
      if (!certificate.endDate.trim()) {
        fieldErrors.endDate = "End Date is required.";
        isValid = false;
      }
      if (!certificate.courseName.trim()) {
        fieldErrors.courseName = "Course Name is required.";
        isValid = false;
      }

      newErrors[index] = fieldErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(
          `${BACKEND_URL}/update-user/${id}`,
          { iCertificates: iCertificates },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setMessage("Certificates updated successfully!");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        }
      } catch (error) {
        setMessage("Failed to update certificates.");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    }
  };

  return (
    <div className="p-1 sm:p-6 sm:pb-0 pb-[110px] bg-gray-950 h-full overflow-y-auto m-4 rounded shadow-md">
      <h1 className="text-white text-xl font-bold mb-6">Update Internship Certificates</h1>
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          } font-medium`}
        >
          {message}
        </p>
      )}

      {iCertificates.map((certificate, index) => (
        <div
          key={index}
          className="mb-6 p-4 bg-[#18181b] rounded shadow relative"
        >
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Name:</label>
            <input
              type="text"
              value={certificate.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="Enter certificate name"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].name && (
              <p className="text-red-500 text-sm">{errors[index].name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Status:</label>
            <select
              value={certificate.status}
              onChange={(e) => handleChange(index, "status", e.target.value === "true")}
              className="w-full px-3 py-2 rounded border border-gray-400"
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
            {errors[index] && errors[index].status && (
              <p className="text-red-500 text-sm">{errors[index].status}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Start Date:</label>
            <input
              type="date"
              value={certificate.startDate}
              onChange={(e) => handleChange(index, "startDate", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].startDate && (
              <p className="text-red-500 text-sm">{errors[index].startDate}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">End Date:</label>
            <input
              type="date"
              value={certificate.endDate}
              onChange={(e) => handleChange(index, "endDate", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].endDate && (
              <p className="text-red-500 text-sm">{errors[index].endDate}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Course Name:</label>
            <input
              type="text"
              value={certificate.courseName}
              onChange={(e) => handleChange(index, "courseName", e.target.value)}
              placeholder="Enter course name"
              className="w-full px-3 py-2 rounded border border-gray-400"
            />
            {errors[index] && errors[index].courseName && (
              <p className="text-red-500 text-sm">{errors[index].courseName}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleRemoveCertificate(index)}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddCertificate}
        className="px-5 py-2 bg-green-500 text-black rounded hover:bg-green-600"
      >
        + Add Certificate
      </button>

      <div className="mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Update Certificates
        </button>
      </div>
    </div>
  );
};

export default UpdateIc;
