import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../student/Profile";

function AdminDashboard() {
  const { user } = useSelector((state) => state.user);
  
  const name = user?.name || "Guest";
  const one = name.length > 1 ? name[0] + name[1] : name[0] || "G"; 

  return (
    <div className="flex align-center d-h overflow-y-scroll">
      <div className="w-[300px] c-l p-4 h-full">
        <div className="ls-p-con">
          <div className="ls-p-con-name">
            <h1 className="uppercase">{one}</h1>
          </div>
          <h1>{name}</h1>
        </div>
        <Link to="/admin-dashboard">
          <button className="ls-btn">
            <i className="bi bi-person-circle"></i>&nbsp;&nbsp;Profile
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/all-users">
          <button className="ls-btn">
            <i className="bi bi-people-fill"></i>&nbsp;&nbsp;All Users
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/all-courses">
          <button className="ls-btn">
            <i className="bi bi-bookmark-check-fill"></i>&nbsp;&nbsp;All Courses
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/all-roadmaps">
          <button className="ls-btn">
            <i className="bi bi-journal-code"></i>&nbsp;&nbsp;All RoadMaps
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/all-recordings">
          <button className="ls-btn">
            <i className="bi bi-journal-code"></i>&nbsp;&nbsp;All Recordings
          </button>
        </Link>
        
        <Link to="/admin-dashboard/profile/create-course">
          <button className="ls-btn">
            <i className="bi bi-plus-circle-fill"></i>&nbsp;&nbsp;Create Course
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/create-road-map">
          <button className="ls-btn">
            <i className="bi bi-plus-circle-fill"></i>&nbsp;&nbsp;Create RoadMap
          </button>
        </Link>
        <Link to="/admin-dashboard/profile/create-recordings">
          <button className="ls-btn">
            <i className="bi bi-plus-circle-fill"></i>&nbsp;&nbsp;Create Recordings
          </button>
        </Link>
      </div>
      <div className="w-full h-full p-4">
        <Outlet>
          
        </Outlet>
      </div>
    </div>
  );
}

export default AdminDashboard;
