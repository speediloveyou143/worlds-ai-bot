
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function UpdateData() {
  const { id } = useParams(); // Get the contact ID from the URL
  const [formData, setFormData] = useState({
    offer: "",
    heading: "",
    tag: "",
    insta: "",
    linkedin: "",
    youtube: "",
    channel: "",
    maps: "",
    group: "",
    email: "",
    number: "",
    address: "",
    logo: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch contact data on mount
  useEffect(() => {
    async function fetchContact() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/show-contact/${id}`, // Updated to match your route
          { withCredentials: true }
        );
        if (response.status === 200) {
          // Filter out unwanted fields like _id and __v
          const { _id, __v, ...filteredData } = response.data;
          setFormData(filteredData); // Pre-fill form with only relevant data
        }
      } catch (err) {
        setFormError("Failed to load contact data.");
        console.error("Error fetching contact:", err);
      }
    }
    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation for number field
    if (name === "number") {
      if (!/^\d*$/.test(value)) {
        setFormError("Phone number must contain only digits.");
      } else if (value.length > 10) {
        setFormError("Phone number must not exceed 10 digits.");
      } else if (value.length === 10) {
        setFormError(""); // Clear error if valid
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Define only the fields that should be validated (form fields)
      const requiredFields = [
        "offer",
        "heading",
        "tag",
        "insta",
        "linkedin",
        "youtube",
        "channel",
        "maps",
        "group",
        "email",
        "number",
        "address",
        "logo",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        setFormError(`Please fill in all fields: ${missingFields.join(", ")}`);
        return;
      }

      // Specific validation for number (exactly 10 digits)
      if (!/^\d{10}$/.test(formData.number)) {
        setFormError("Phone number must contain exactly 10 digits.");
        return;
      }

      setFormError("");
      setSuccessMessage("");
      const updatedContact = { ...formData };
      const response = await axios.put(
        `${BACKEND_URL}/update-contact/${id}`, // Updated to match your route
        updatedContact,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccessMessage("Updated successfully");
      } else {
        setFormError("Contact not updated.");
      }
    } catch (err) {
      setFormError("Something went wrong.");
      console.error("Error updating contact:", err);
    }
  };

  return (
    <div className="h-full bg-gray-950 items-start pb-[120px] sm:pb-0 overflow-y-auto bg-gray-950 p-4 flex flex-col ">
      <div className="w-full sm:w-2/3 bg-base-300 p-2 sm:p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
        <h1 className="text-4xl">Update Data</h1>
        {successMessage && (
          <p className="text-success mt-3">{successMessage}</p>
        )}
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Offer:
          <input
            type="text"
            name="offer"
            value={formData.offer}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Heading:
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Tag:
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Instagram URL:
          <input
            type="url"
            name="insta"
            value={formData.insta}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          LinkedIn URL:
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          YouTube URL:
          <input
            type="url"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Channel:
          <input
            type="text"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Google Maps URL:
          <input
            type="url"
            name="maps"
            value={formData.maps}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Group URL:
          <input
            type="url"
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Phone Number:
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="grow"
            maxLength="10" // Limits input to 10 characters
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Logo URL:
          <input
            type="url"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="grow"
          />
        </label>
        <p className="text-error">{formError}</p>
        <button onClick={handleSubmit} className="btn w-full mt-3 btn-info">
          Update Data
        </button>
      </div>
    </div>
  );
}

export default UpdateData;