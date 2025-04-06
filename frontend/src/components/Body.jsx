
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/profile", {
        withCredentials: true,
      });
      if (res.status === 200) {
        dispatch(setUser(res.data));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
      }
      // Do nothing (Silently handle the error)
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Body;
