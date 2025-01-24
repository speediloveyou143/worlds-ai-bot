import React from "react";
import { Outlet,Link } from "react-router-dom";
import { useSelector } from "react-redux";
function StudentDashboard() {
  const {user} = useSelector((state) => state.user);
  // const name=user?.name
  const name = user?.name || "Guest";
  const one = name.length > 1 ? name[0] + name[1] : name[0] || "G";

  return (
    <div className="flex align-center d-h overflow-y-scroll">
      <div className="w-[300px] h-full c-l  p-4">
        <div className="ls-p-con">
          <div className="ls-p-con-name">
            <h1 className="uppercase">{one}</h1>
          </div>
          <h1>{name}</h1>
        </div>
       <Link to="/student-dashboard/profile"><button className="ls-btn"><i className="bi bi-person-circle"></i>&nbsp;&nbsp;Profile</button></Link> 
        <Link to="/student-dashboard/profile/lectures"><button className="ls-btn"><i className="bi bi-play-circle-fill"></i>&nbsp;&nbsp;Lectures</button></Link> 
        <Link to="/student-dashboard/profile/awards"><button className="ls-btn"><i className="bi bi-award-fill"></i>&nbsp;&nbsp;Certificates</button></Link> 
        <Link to="/student-dashboard/profile/resume-templates"><button className="ls-btn"><i className="bi bi-journal-code"></i>&nbsp;&nbsp;Resume</button></Link> 
        <Link to="/student-dashboard/profile/interview-preparation"><button className="ls-btn"><i className="bi bi-journal-text"></i>&nbsp;&nbsp;Interview</button></Link> 
        <Link to="/student-dashboard/profile/editor"><button className="ls-btn"><i className="bi bi-code-slash"></i>&nbsp;&nbsp;Editor</button></Link> 
        <Link to="/student-dashboard/profile/invoice"><button className="ls-btn"><i className="bi bi-coin"></i>&nbsp;&nbsp;Invoice</button></Link> 
      </div>
      <div className=" w-full h-full  p-4">
        <Outlet/>
      </div>
    </div>
  );
}

export default StudentDashboard;
