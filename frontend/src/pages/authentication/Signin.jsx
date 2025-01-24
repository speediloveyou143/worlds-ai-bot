import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";
function Signin() {
  const [email, setEmail] = useState("prasanthreddy5b0@gmail.com");
  const [password, setPassword] = useState("prasanth");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  async function handleSignIn() {
    try {
      setLoading(true);
      setFormError(""); // Clear any previous error

      // Simple validation
      if (!email || !password) {
        setFormError("Email and password are required");
        setLoading(false);
        return;
      }

      // Call the backend API
      const response = await axios.post(
        "http://localhost:4000/signin",
        { email, password },
        { withCredentials: true }
      );
     console.log("login fetch:",response)
      dispatch(setUser(response.data.user))
      navigate('/')
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="w-2/6 bg-base-300 p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
      <h1 className="text-4xl text-center">Let's Sign In</h1>
      <p className="text-center">Learn with the world's first AI bot</p>

      <label className="input input-bordered flex items-center gap-2 mt-3">
        Email:
        <input
          type="text"
          className="grow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="input input-bordered flex items-center gap-2 mt-3">
        Password:
        <input
          type="password"
          className="grow"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {formError && <p className="text-red-500 mt-2">{formError}</p>}

      <button
        type="button"
        className="btn w-full mt-3 btn-info"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-center mt-2">
        <a href="#">Forgot password?</a>
      </p>
      <p className="text-center mt-2">
        Don’t have an account?{" "}
        <a className="text-info" href="/signup">
          Sign Up
        </a>
      </p>
    </div>
  );
}

export default Signin;
