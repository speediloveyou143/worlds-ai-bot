import React from "react";
import { useState } from "react";
import axios from "axios";
import { SignupFormValidate } from "../../utils/signupFormvalidate";
function Signup(){
  const [name,setName]=useState('')
  const [number,setNumber]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [cPassword,setCPassword]=useState('')
  const [formError,setFormError]=useState('')
  const [loading, setLoading] = useState(false);

  async function handleSignUp(){
  try{
    const result=SignupFormValidate(name,number,email,password,cPassword)
    if(result){
      setFormError(result)
    }
    else{
      setFormError("")
      const user={
        "name":name,
        "number":number,
        "email":email,
        "password":password,
      }
      const response=await axios.post("http://localhost:4000/signup",user,{ withCredentials: true })
    }}
    catch(err){
      setFormError(err.response?.data?.message || "Invalid credentials");
    }finally {
      setLoading(false);
    }
    
  }
  return (
    <div className="w-2/6 bg-base-300 p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
      <h1 className="text-4xl ">signup for free</h1>
      <p className="">Learn with the first worldsAIbot</p>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Full Name:
        <input type="text" className="grow " value={name} onChange={(e)=>{setName(e.target.value)}} />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Mobile number:
        <input type="number" className="grow " value={number} onChange={(e)=>{setNumber(e.target.value)}}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Email:
        <input type="text" className="grow " value={email} onChange={(e)=>{setEmail(e.target.value)}} />
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Password:
        <input type="password" className="grow " value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 mt-3">
        Confirm Password:
        <input type="password" className="grow " value={cPassword} onChange={(e)=>{setCPassword(e.target.value)}} />
      </label>
      <p className="text-secondary">{formError}</p>
      <button className="btn w-full mt-3 btn-info" onClick={handleSignUp}>Signup</button>
      <p className=" mt-2">Already have an account ? <a className="text-info" href="/signin">sign in</a></p>
    </div>
  );
}

export default Signup;
