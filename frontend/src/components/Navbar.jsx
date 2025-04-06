
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const name = user?.name;
  const role = user?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [bootcamps, setBootcamps] = useState([]); // State to store dynamic bootcamp data

  // Fetch bootcamps from backend on component mount
  useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const response = await axios.get("http://localhost:4000/show-roadmap-topic");
        setBootcamps(response.data);
      } catch (error) {
        console.error("Failed to fetch bootcamps:", error);
      }
    };
    fetchBootcamps();
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:4000/signout", {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/signin");
    } catch (error) {
      alert("Failed to sign out. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="navbar fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#702CF6] to-[#4B0082] shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-white hover:bg-purple-600/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
          </div>
          <Link to="/" className="text-2xl font-bold text-white antialiased hover:text-gray-200 transition-colors px-4">
            WorldsAIbot
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            <li>
              <Link to="/" className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all ${isActive("/") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className={`px-4 py-2 text-white hover:bg-purple-600/80 rounded-lg transition-all ${
                  isActive("/courses") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""
                }`}
              >
                COURSES
              </Link>
            </li>
            <li className="relative">
              <div
                onMouseEnter={() => setIsCoursesOpen(true)}
                onMouseLeave={() => setIsCoursesOpen(false)}
                className="relative"
              >
                <button className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all flex items-center gap-1 ${isActive("/free-class") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                  BOOTCAMPS
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCoursesOpen && (
                  <div className="absolute top-full left-0 w-48 bg-gradient-to-b from-[#1a1a1a] to-[#000000] rounded-lg shadow-lg py-2 z-50">
                    {bootcamps.map((bootcamp) => (
                      <Link
                        key={bootcamp.id}
                        to={`/free-class/${bootcamp.id}`} // Pass id as URL parameter
                        className="block px-4 py-2 text-white hover:bg-purple-600/20 transition-colors"
                      >
                        {bootcamp.roadMapName}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link to="/about-us" className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all ${isActive("/about-us") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                ABOUT US
              </Link>
            </li>
            <li>
              <Link to="/products" className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all ${isActive("/products") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                PRODUCTS
              </Link>
            </li>
            <li>
              <Link to="/carrers" className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all ${isActive("/carrers") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                CAREERS
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`px-4 py-2 text-white hover:bg-purple-600/20 rounded-lg transition-all ${isActive("/contact") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
                CONTACT
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {!user && (
            <div className="flex gap-2 px-4">
              <Link to="signin">
                <button className="px-4 py-1.5 bg-white text-[#702CF6] rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap">
                  SIGN IN
                </button>
              </Link>
              <Link to="signup">
                <button className="px-4 py-1.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap">
                  SIGN UP
                </button>
              </Link>
            </div>
          )}
          {user && (
            <div className="dropdown dropdown-end px-4">
              <div
                tabIndex={0}
                role="button"
                className="w-10 h-10 rounded-full bg-purple-700 flex justify-center items-center hover:bg-purple-800 transition-all cursor-pointer"
              >
                <h1 className="text-lg font-bold text-white uppercase">
                  {name[0] + name[1]}
                </h1>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gradient-to-b from-[#1a1a1a] to-[#000000] rounded-lg w-52 space-y-1">
                <li>
                  <Link
                    to={role === "student" ? "/student-dashboard/profile" : "/admin-dashboard"}
                    onClick={() => document.activeElement.blur()}
                    className="text-white hover:bg-purple-600/20"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a onClick={handleSignOut} className="text-white hover:bg-purple-600/20 cursor-pointer">
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed top-16 left-0 h-full w-64 bg-gradient-to-b from-[#1a1a1a] to-[#000000] shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-4 space-y-2">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block text-white hover:bg-purple-600/20 rounded-lg transition-all p-2 ${isActive("/") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
            HOME
          </Link>
          <Link
            to="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block text-white hover:bg-purple-600/80 rounded-lg transition-all p-2 ${
              isActive("/courses") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""
            }`}
          >
            COURSES
          </Link>
          <div className="space-y-1">
            <button className="w-full text-left text-white p-2 hover:bg-purple-600/20 rounded-lg">
              BOOTCAMPS
            </button>
            <div className="pl-4 space-y-1">
              {bootcamps.map((bootcamp) => (
                <Link
                  key={bootcamp.id}
                  to={`/free-class/${bootcamp.id}`} // Pass id as URL parameter
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white hover:bg-purple-600/20 rounded-lg p-2 text-sm"
                >
                  {bootcamp.roadMapName}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className={`block text-white hover:bg-purple-600/20 rounded-lg transition-all p-2 ${isActive("/about-us") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
            ABOUT US
          </Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`block text-white hover:bg-purple-600/20 rounded-lg transition-all p-2 ${isActive("/products") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
            PRODUCTS
          </Link>
          <Link to="/carrers" onClick={() => setIsMobileMenuOpen(false)} className={`block text-white hover:bg-purple-600/20 rounded-lg transition-all p-2 ${isActive("/carrers") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
            CAREERS
          </Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block text-white hover:bg-purple-600/20 rounded-lg transition-all p-2 ${isActive("/contact") ? "bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]" : ""}`}>
            CONTACT
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="pt-16" />
    </>
  );
}

export default Navbar;