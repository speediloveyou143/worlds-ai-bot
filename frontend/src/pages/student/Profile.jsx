import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProfileUpdateValidate } from "../../utils/profileUpdateValidate";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [formError, setFormError] = useState("");
  const [greeting, setGreeting] = useState("");

  // Function to fetch profile data
  async function profile() {
    try {
      const { data } = await axios.get("http://localhost:4000/profile", {
        withCredentials: true,
      });
      const { name, number, university } = data;
      setName(name || "");
      setNumber(number || "");
      setUniversityName(university || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  // Function to set greeting based on time
  function updateGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }

  // UseEffect to fetch profile and set greeting
  useEffect(() => {
    profile();
    updateGreeting();
  }, []);

  const handleProfileSave = async () => {
    const validationError = ProfileUpdateValidate(name, number, universityName);

    if (validationError) {
      setFormError(validationError);
      clearError();
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:4000/profile/edit",
        { name, universityName, number },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setFormError("Profile updated successfully!");
        clearError(() => {
          navigate("/student-dashboard/profile");
          window.location.reload();
        });
      } else {
        setFormError(response.message || "An error occurred!");
        clearError();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormError("Failed to update profile. Please try again later.");
      clearError();
    }
  };

  const clearError = (callback = () => {}) => {
    setTimeout(() => {
      setFormError("");
      callback();
    }, 2000);
  };

  return (
    <div className="s-profile">
      <div className="avatar online placeholder">
        <div className="bg-black text-white w-32 rounded-full">
          <span className="text-6xl font-bold uppercase">
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
      <h1 className="text-4xl">{greeting}</h1>
      <h1 className="text-3xl">Welcome Back {name}!</h1>
      <div className="w-3/6 bg-base-400 p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Full Name:
          <input
            type="text"
            className="grow"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Mobile number:
          <input
            type="number"
            className="grow"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-3">
          College Name:
          <input
            type="text"
            className="grow"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
          />
        </label>
        <p className="text-secondary">{formError}</p>
        <button
          className="btn w-full mt-3 btn-info"
          onClick={handleProfileSave}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
