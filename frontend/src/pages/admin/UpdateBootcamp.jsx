import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from "../../../config/constant";

function UpdateBootcamp() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    days: '',
    courseName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    courseRoadmap: [['']],
    videoUrl: '',
    instructors: [{ name: '', role: '', description: '' }],
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/show-bootcamp/${id}`);
        const data = response.data;

        // Convert dates to YYYY-MM-DD format
        const formattedData = {
          ...data,
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
        };

        setFormData(formattedData);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e, index, type, subIndex) => {
    const { name, value } = e.target;
    if (type === 'courseRoadmap') {
      const newRoadmap = [...formData.courseRoadmap];
      newRoadmap[index][subIndex] = value;
      setFormData({ ...formData, courseRoadmap: newRoadmap });
    } else if (type === 'instructors') {
      const newInstructors = [...formData.instructors];
      newInstructors[index][name] = value;
      setFormData({ ...formData, instructors: newInstructors });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addRoadmap = () => {
    setFormData({
      ...formData,
      courseRoadmap: [...formData.courseRoadmap, ['']],
    });
  };

  const addTopic = (index) => {
    const newRoadmap = [...formData.courseRoadmap];
    newRoadmap[index].push('');
    setFormData({ ...formData, courseRoadmap: newRoadmap });
  };

  const addInstructor = () => {
    setFormData({
      ...formData,
      instructors: [...formData.instructors, { name: '', role: '', description: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/update-bootcamp/${id}`, formData,{ withCredentials: true });
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="bg-gray-950 h-full overflow-y-auto  sm:p-6 p-2  text-white]">
      <h1 className="text-3xl font-bold text-[#64ffda] text-center mb-8">Update Bootcamp</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 rounded-lg  p-4 sm:pb-[0px] pb-[120px]">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Days</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Course Roadmap</label>
          {formData.courseRoadmap.map((roadmap, index) => (
            <div key={index} className="mb-4">
              {roadmap.map((topic, subIndex) => (
                <input
                  key={subIndex}
                  type="text"
                  value={topic}
                  onChange={(e) => handleChange(e, index, 'courseRoadmap', subIndex)}
                  className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6] mb-2"
                  required
                />
              ))}
              <button
                type="button"
                onClick={() => addTopic(index)}
                className="bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded"
              >
                Add Topic
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoadmap}
            className="bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded"
          >
            Add Roadmap
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Instructors</label>
          {formData.instructors.map((instructor, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={instructor.name}
                onChange={(e) => handleChange(e, index, 'instructors')}
                className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6] mb-2"
                required
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={instructor.role}
                onChange={(e) => handleChange(e, index, 'instructors')}
                className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6] mb-2"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={instructor.description}
                onChange={(e) => handleChange(e, index, 'instructors')}
                className="w-full p-2 bg-[#112240] rounded text-[#ccd6f6] mb-2"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addInstructor}
            className="bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded"
          >
            Add Instructor
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded font-bold"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}

export default UpdateBootcamp;