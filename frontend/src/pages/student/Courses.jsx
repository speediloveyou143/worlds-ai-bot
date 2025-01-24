import React from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import { useState, useEffect } from "react";


function Course(props) {
  return (
    <div className="card shadow-2xl bg-base-300 w-80 m-4 shadow-xl h-fit">
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
          <Link to={"/buy-now/"+props.data.nextId+"/"+props.data._id}><div className="badge p-4 badge-outline rounded bg-success text-black cursor-pointer p-3">
            Visit & Buy Now
          </div></Link>
        </div>
      </div>
    </div>
  );
}
function Courses() {
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
    <div className="h-full overflow-y-scroll flex flex-wrap align-center">
      {courses.map((x, index) => {
        return <Course key={index} data={x} />;
      })}
    </div>
  );
}

export default Courses;
