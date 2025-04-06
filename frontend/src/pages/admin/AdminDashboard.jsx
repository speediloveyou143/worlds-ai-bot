
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user } = useSelector((state) => state.user);
  const name = user?.name || "Guest";
  const one = name.length > 1 ? name[0] + name[1] : name[0] || "G";
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const dispatch =useDispatch();
  const navigate=useNavigate()
  

  const sidebarOptions = [
    { to: "/admin-dashboard", icon: "bi bi-person-circle", label: "Profile" },
    { to: "/admin-dashboard/profile/all-users", icon: "bi bi-people-fill", label: "All Users" },
    { to: "/admin-dashboard/profile/all-registers", icon: "bi bi-person-check-fill", label: "All Registers" },
    // Courses
    { to: "/admin-dashboard/profile/create-course", icon: "bi bi-plus-square-fill", label: "Create Course" },
    { to: "/admin-dashboard/profile/all-courses", icon: "bi bi-book-fill", label: "All Courses" },
    // Roadmaps
    { to: "/admin-dashboard/profile/create-road-map", icon: "bi bi-signpost-split-fill", label: "Create Roadmap" },
    { to: "/admin-dashboard/profile/all-roadmaps", icon: "bi bi-map-fill", label: "All Roadmaps" },
    // Recordings
    { to: "/admin-dashboard/profile/create-recordings", icon: "bi bi-mic-mute-fill", label: "Create Recordings" },
    { to: "/admin-dashboard/profile/all-recordings", icon: "bi bi-mic-fill", label: "All Recordings" },
    // Company Logos
    { to: "/admin-dashboard/profile/create-logo", icon: "bi bi-brush-fill", label: "Create Company Logo" },
    { to: "/admin-dashboard/profile/all-company-logos", icon: "bi bi-building", label: "All Company Logos" },
    // Videos
    { to: "/admin-dashboard/profile/create-video", icon: "bi bi-play-btn-fill", label: "Create Video" },
    { to: "/admin-dashboard/profile/all-videos", icon: "bi bi-camera-video-fill", label: "All Videos" },
    // Privacy
    { to: "/admin-dashboard/profile/create-privacy", icon: "bi bi-shield-lock-fill", label: "Create Privacy Policy" },
    { to: "/admin-dashboard/profile/all-privacy", icon: "bi bi-lock-fill", label: "All Privacy Policies" },
    // Bootcamps
    { to: "/admin-dashboard/profile/create-bootcamp", icon: "bi bi-code-square", label: "Create Bootcamp" },
    { to: "/admin-dashboard/profile/all-bootcamps", icon: "bi bi-laptop-fill", label: "All Bootcamps" },
    // Roadmap Topics
    { to: "/admin-dashboard/profile/create-road-map-topics", icon: "bi bi-list-task", label: "Create Roadmap Topics" },
    { to: "/admin-dashboard/profile/all-road-map-topics", icon: "bi bi-list-check", label: "All Roadmap Topics" },
    // Jobs
    { to: "/admin-dashboard/profile/create-job", icon: "bi bi-briefcase-fill", label: "Create Job" },
    { to: "/admin-dashboard/profile/all-jobs", icon: "bi bi-briefcase", label: "All Jobs" },
    // Data
    { to: "/admin-dashboard/profile/create-data", icon: "bi bi-database-fill", label: "Create Data" },
    { to: "/admin-dashboard/profile/all-create-data", icon: "bi bi-database", label: "All Data" },
    // Tests
    { to: "/admin-dashboard/profile/create-test", icon: "bi bi-clipboard-check-fill", label: "Create Test" },
    { to: "/admin-dashboard/profile/all-tests", icon: "bi bi-clipboard-data", label: "All Tests" },
  ];

  const visibleOptions = sidebarOptions.slice(0, 4);
  const hiddenOptions = sidebarOptions.slice(4);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:4000/signout", {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/signin");
    } catch (error) {
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white">
      {/* Left Sidebar */}
      <div className="hidden md:flex flex-col w-[300px] bg-gray-900/50 p-4 h-[calc(100vh-64px)] fixed left-0 top-16 overflow-y-auto border-r border-blue-800/30">
        {/* Profile Section */}
        <div className="ls-p-con mb-6 gap-1 flex items-center space-x-3">
          <h1 className="w-12 bg-black text-white h-12 flex items-center justify-center font-bold text-xl rounded-full">
            {one.toUpperCase()}
          </h1>
          <h1 className="text-xl truncate w-40">{name}</h1>
        </div>

        {/* Sidebar Options */}
        <div className="flex flex-col flex-grow">
          {sidebarOptions.map((option, index) => (
            <div key={index}>
              <Link to={option.to}>
                <button
                  className={`w-full text-left p-3 rounded-lg hover:bg-blue-900/30 transition-all duration-200 ${
                    isActive(option.to) ? "bg-blue-900/50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <i className={option.icon}></i>  {option.label}
                </button>
              </Link>
              {/* Add a subtle separator after "All" items for grouped pairs */}
              {option.label.startsWith("All") && index < sidebarOptions.length - 1 && index > 1 && (
                <hr className="my-2 border-blue-800/20" />
              )}
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <button
          className="w-full text-left p-3 rounded-lg hover:bg-blue-900/30 transition-all duration-200 mt-auto"
          onClick={handleSignOut}
        >
          <i className="bi bi-box-arrow-right"></i>  Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-950 mt-1 md:pb-10 md:ml-[300px] h-[calc(100vh-64px)] fixed top-16 w-full md:w-[calc(100vw-300px)]">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900/50 backdrop-blur-sm p-2 flex justify-around items-center border-t border-blue-800/30 rounded-t-lg">
        {visibleOptions.map((option, index) => (
          <Link key={index} to={option.to}>
            <button
              className={`flex flex-col items-center space-y-1 p-2 hover:bg-blue-900/30 rounded-lg transition-all duration-200 ${
                isActive(option.to) ? "bg-blue-900/50" : ""
              }`}
            >
              <i className={option.icon}></i>
              <span className="text-xs">{option.label}</span>
            </button>
          </Link>
        ))}

        <div className="relative">
          <button
            className="flex flex-col items-center space-y-1 p-2 hover:bg-blue-900/30 rounded-lg transition-all duration-200"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
          >
            <i className="bi bi-three-dots-vertical"></i>
            <span className="text-xs">More</span>
          </button>

          {isMoreOpen && (
            <div className="absolute bottom-14 right-0 bg-gray-900/70 backdrop-blur-md p-2 rounded-lg border border-blue-800/30">
              {hiddenOptions.map((option, index) => (
                <Link
                  key={index}
                  to={option.to}
                  onClick={() => setIsMoreOpen(false)}
                >
                  <button
                    className={`flex items-center space-x-2 w-full p-2 hover:bg-blue-900/30 rounded-lg transition-all duration-200 ${
                      isActive(option.to) ? "bg-blue-900/50" : ""
                    }`}
                  >
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;