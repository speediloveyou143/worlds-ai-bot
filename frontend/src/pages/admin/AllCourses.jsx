import React from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import { useState, useEffect } from "react";

function Course(props) {
  async function handleDelete() {
    try {
      if (window.confirm("are you sure you want to delete this course?")) {
        const response = await axios.delete(
          `http://localhost:4000/delete-course/${props.data._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          alert("course deleted successfully!");
          window.location.reload()
        } else {
          alert("Failed to delete the course.");
        }
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  }
  
  return (
    <div className="card shadow-2xl bg-base-300 w-80 my-4 shadow-xl h-fit">
      <figure>
        <img
          src={props.data.imageUrl}
          alt="Shoes"
          className="h-[170px] w-full"
        />
      </figure>
      <div className="card-body p-3">
        <h2 className="card-title">
          {props.data.courseName}
          <div className="badge badge-secondary">English</div>
        </h2>
        <div className="flex align-center justify-between">
          <div>
          <p className="p-0 m-0">
            Mode:<span className="">Online</span>
          </p>
          
          <p className="p-0 m-0">
            Status:<span className="text-success">Ongoing</span>
          </p>
          </div>
          <div>
          <p className="p-0 m-0">Price:{props.data.price}</p>
          <p className="p-0 m-0">Duration:{props.data.duration} days</p>
          </div>
          
        </div>
        <p className="p-0 m-0">
            Free Internship:<span className="text-success">Available</span>
        </p >
        <p className="p-0 m-0">Certificate:Completion+Internship</p>

        <p className="p-0 m-0">
          Recordings:{props.data.hours}+hrs
          <span className="badge bg-success text-black font-bold">
            Life Time Access
          </span>
        </p>

        <div className="card-actions justify-end">
          <Link to={"/admin-dashboard/profile/all-courses/"+props.data._id}><div className="badge badge-outline bg-success text-black cursor-pointer p-3">
            Update
          </div></Link>
          <div className="badge badge-outline bg-error text-black cursor-pointer p-3" onClick={handleDelete}>
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}
function AllCourses() {
  const [courses, setCourses] = useState([]);

  async function fetchCourses() {
    const response = await axios.get("http://localhost:4000/show-courses", {
      withCredentials: true,
    });
    setCourses(response?.data?.data);
  }
  useEffect(() => {
    fetchCourses();
  }, []);
  if (courses.length == 0) {
    return <div>no courses found</div>;
  }
  return (
    <div className="h-full overflow-y-scroll flex flex-wrap align-center  justify-evenly">
      {courses.map((x, index) => {
        return <Course key={index} data={x} />;
      })}
    </div>
  );
}

export default AllCourses;
