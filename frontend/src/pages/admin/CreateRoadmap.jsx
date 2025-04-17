import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

const RoadMapForm = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState({
    courseName: "",
    tutorName: "",
    tutorDescription: "",
    tutorImageUrl: "",
    skills: [
      {
        skillName: "",
        subTopics: [""],
      },
    ],
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoadmap({ ...roadmap, [name]: value });
  };

  // Handle skill name change
  const handleSkillNameChange = (index, value) => {
    const updatedSkills = [...roadmap.skills];
    updatedSkills[index].skillName = value;
    setRoadmap({ ...roadmap, skills: updatedSkills });
  };

  // Handle topic change
  const handleTopicChange = (skillIndex, topicIndex, value) => {
    const updatedSkills = [...roadmap.skills];
    updatedSkills[skillIndex].subTopics[topicIndex] = value;
    setRoadmap({ ...roadmap, skills: updatedSkills });
  };

  // Add a new topic for a specific skill
  const addTopic = (skillIndex) => {
    const updatedSkills = [...roadmap.skills];
    updatedSkills[skillIndex].subTopics.push("");
    setRoadmap({ ...roadmap, skills: updatedSkills });
  };

  // Add a new skill
  const addSkill = () => {
    setRoadmap({
      ...roadmap,
      skills: [
        ...roadmap.skills,
        {
          skillName: "",
          subTopics: [""],
        },
      ],
    });
  };

  // Remove a topic
  const removeTopic = (skillIndex, topicIndex) => {
    const updatedSkills = [...roadmap.skills];
    updatedSkills[skillIndex].subTopics.splice(topicIndex, 1);
    setRoadmap({ ...roadmap, skills: updatedSkills });
  };

  // Remove a skill
  const removeSkill = (skillIndex) => {
    const updatedSkills = [...roadmap.skills];
    updatedSkills.splice(skillIndex, 1);
    setRoadmap({ ...roadmap, skills: updatedSkills });
  };

  // Validation Function
  const validate = () => {
    const newErrors = {};
    if (!roadmap.courseName.trim()) {
      newErrors.courseName = "Course Name is required.";
    }
    if (!roadmap.tutorName.trim()) {
      newErrors.tutorName = "Tutor Name is required.";
    }
    if (!roadmap.tutorDescription.trim()) {
      newErrors.tutorDescription = "Tutor Description is required.";
    }
    if (!roadmap.tutorImageUrl.trim()) {
      newErrors.tutorImageUrl = "Tutor Image URL is required.";
    }
    roadmap.skills.forEach((skill, skillIndex) => {
      if (!skill.skillName.trim()) {
        newErrors[`skillName-${skillIndex}`] = "Skill Name is required.";
      }
      skill.subTopics.forEach((topic, topicIndex) => {
        if (!topic.trim()) {
          newErrors[`subTopic-${skillIndex}-${topicIndex}`] =
            "Topic is required.";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/create-roadmap`,
          roadmap,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("Roadmap stored in db!!");
          navigate("/admin-dashboard/profile/all-roadmaps");
        } else {
          alert("Roadmap not stored in db!!");
        }
      } catch (err) {
        alert("Something went wrong with db!!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:p-6 p-0 sm:pb-0 pb-[120px] bg-[#030712] h-full overflow-y-auto m-4 rounded shadow-md"
    >
      <div className="mb-4">
        <label className="block text-white font-medium mb-2">Course Name:</label>
        <input
          type="text"
          name="courseName"
          value={roadmap.courseName}
          onChange={handleInputChange}
          placeholder="Enter course name"
          className="w-full px-3 py-2 rounded border border-gray-400"
        />
        {errors.courseName && (
          <p className="text-red-500 text-sm">{errors.courseName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-white font-medium mb-2">Tutor Name:</label>
        <input
          type="text"
          name="tutorName"
          value={roadmap.tutorName}
          onChange={handleInputChange}
          placeholder="Enter tutor name"
          className="w-full px-3 py-2 rounded border border-gray-400"
        />
        {errors.tutorName && (
          <p className="text-red-500 text-sm">{errors.tutorName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-white font-medium mb-2">Tutor Description:</label>
        <textarea
          name="tutorDescription"
          value={roadmap.tutorDescription}
          onChange={handleInputChange}
          placeholder="Enter tutor description"
          className="w-full px-3 py-2 rounded border border-gray-400"
        />
        {errors.tutorDescription && (
          <p className="text-red-500 text-sm">{errors.tutorDescription}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-white font-medium mb-2">Tutor Image URL:</label>
        <input
          type="text"
          name="tutorImageUrl"
          value={roadmap.tutorImageUrl}
          onChange={handleInputChange}
          placeholder="Enter tutor image URL"
          className="w-full px-3 py-2 rounded border border-gray-400"
        />
        {errors.tutorImageUrl && (
          <p className="text-red-500 text-sm">{errors.tutorImageUrl}</p>
        )}
      </div>

      {roadmap.skills.map((skill, skillIndex) => (
        <div
          key={skillIndex}
          className="mb-6 p-4 bg-[#18181b] rounded shadow relative"
        >
          <label className="block text-white font-medium mb-2">
            Skill Name:
          </label>
          <input
            type="text"
            value={skill.skillName}
            onChange={(e) => handleSkillNameChange(skillIndex, e.target.value)}
            placeholder="Enter skill name"
            className="w-full px-3 py-2 rounded border border-gray-400"
          />
          {errors[`skillName-${skillIndex}`] && (
            <p className="text-red-500 text-sm">
              {errors[`skillName-${skillIndex}`]}
            </p>
          )}
          <button
            type="button"
            onClick={() => removeSkill(skillIndex)}
            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete Skill
          </button>

          <div className="mt-4">
            <strong className="block text-white font-medium mb-2">Topics:</strong>
            {skill.subTopics.map((topic, topicIndex) => (
              <div key={topicIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) =>
                    handleTopicChange(skillIndex, topicIndex, e.target.value)
                  }
                  placeholder="Enter topic"
                  className="w-full px-3 py-2 rounded border border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => removeTopic(skillIndex, topicIndex)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                {errors[`subTopic-${skillIndex}-${topicIndex}`] && (
                  <p className="text-red-500 text-sm ml-2">
                    {errors[`subTopic-${skillIndex}-${topicIndex}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addTopic(skillIndex)}
              className="mt-2 px-3 py-2 bg-green-700 text-black font-bolder rounded"
            >
              + Add Topic
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="mb-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
      >
        + Add Skill
      </button>

      <div>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Create Road Map
        </button>
      </div>
    </form>
  );
};

export default RoadMapForm;