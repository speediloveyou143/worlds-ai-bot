import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
function Navbar(){
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {user} = useSelector((state) => state.user);
  const name=user?.name
  const role=user?.role
  async function handleSignOut(){
       await axios.post("http://localhost:4000/signout",{},{withCredentials:true})
       dispatch(clearUser())
       navigate('/signin')
  }

  return (
    <>
       <div className="navbar bg-base-300 w-navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/">HOME</Link>
              </li>
              <li>
                <Link to="/courses">COURSES</Link>
              </li>
              <li>
                <Link to="/contact">CONTACT</Link>
              </li>
            </ul>
          </div>
          <a className="text-3xl font-extrabold antialiased">Java Home Cloud</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">HOME</Link>
            </li>
            <li>
              <Link to="/courses">COURSES</Link>
            </li>
            <li>
              <Link to="/contact">CONTACT</Link>
            </li>
          </ul>
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="toggle toggle-accent"
                defaultChecked
              />
            </label>
          </div>
        </div>
        <div className="navbar-end">
          {!user && (
            <div>
              <Link to="signin">
                <button className="btn btn-outline btn-info mx-1">SIGNIN</button>
              </Link>
              <Link to="signup">
                <button className="btn btn-outline btn-info mx-1">SIGNUP</button>
              </Link>
            </div>
          )}
          {user && (
           <div className="dropdown dropdown-end">
           <div
             tabIndex={0}
             role="button"
             className="w-15 h-15 rounded-full border-2 border-blue-500 btn btn-ghost btn-circle flex justify-center items-center"
           >
             <div className="w-15 h-15 flex justify-center items-center">
               <h1 className="text-2xl text-center uppercase">{name[0]+name[1]}</h1>
             </div>
           </div>
           <ul
             tabIndex={0}
             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
           >
             <li>
               <Link to="/profile" className="justify-between">
                 Profile
                 <span className="badge">New</span>
               </Link>
             </li>
             <li>
               <Link to={(user&&role=="student")?"/student-dashboard/profile":"/admin-dashboard"}>Dashboard</Link>
               {/* <Link>Dashboard</Link> */}
             </li>
             <li>
               <a onClick={handleSignOut}>Signout</a>
             </li>
           </ul>
         </div>
         
          )}
        </div>
      </div> 
    </>
  );
}

export default Navbar;
