import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AllBootcamps() {
  const [bootcamps, setBootcamps] = useState([]);

  useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const response = await axios.get('http://localhost:4000/all-bootcamps');
        console.log(response.data)
        setBootcamps(response.data);
      } catch (error) {
        console.error('Error fetching bootcamps:', error);
      }
    };
    fetchBootcamps();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/delete-bootcamp/${id}`);
      setBootcamps(bootcamps.filter((bootcamp) => bootcamp._id !== id));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen p-5 text-[#ccd6f6]">
      <h1 className="text-center text-[#64ffda] mb-8 text-3xl font-bold">All Bootcamps</h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {bootcamps.map((bootcamp) => (
          <div
            key={bootcamp._id}
            className="bg-[#112240] p-5 rounded-lg w-72 shadow-lg transition-transform duration-200 cursor-pointer hover:scale-105 text-[#ccd6f6]"
          >
            <h2 className="text-[#64ffda] mb-3 text-xl font-semibold">{bootcamp.courseName}</h2>
            <p>{bootcamp._id}</p>
            <div className="flex gap-3 mt-5">
              <Link
                to={`/admin-dashboard/profile/update-bootcamp/${bootcamp._id}`}
                className="flex-1 text-center no-underline bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded-lg font-bold"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(bootcamp._id)}
                className="flex-1 bg-[#ff4d4d] text-[#0a192f] px-4 py-2 rounded-lg font-bold border-none cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBootcamps;