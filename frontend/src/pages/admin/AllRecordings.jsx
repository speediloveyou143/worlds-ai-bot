import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
function RecordingCard(props){
  async function handleDelete() {
      try {
        if (window.confirm("are you sure you want to delete this course?")) {
          const response = await axios.delete(
            `http://localhost:4000/delete-recordings/${props.data._id}`,
            { withCredentials: true }
          );
          if (response.status === 200) {
            alert("Recordings deleted successfully!");
            window.location.reload()
          } else {
            alert("Failed to delete the Recordings.");
          }
        }
      } catch (error) {
        console.log("Error deleting course:", error);
        alert("An error occurred while deleting the Recordings.");
      }
    }
  return <div className="card bg-[#16191F] text-white my-2 ">
  <div className="card-body items-center text-center">
    <h2 className="card-title">{props.data.batchNumber}</h2>
    <p>{props.data._id}</p>
    <div className="card-actions justify-end">
      <Link to={"/admin-dashboard/profile/update-recordings/"+props.data._id}><button className="badge rounded py-4 px-4 bg-success text-black">Update</button></Link>
      <button className="badge rounded py-4 px-4 bg-error text-black" onClick={handleDelete}>Delete</button>
    </div>
  </div>
</div>
}
function AllRecordings() {
 const [recordings,setRecordings]=useState([])
 async function fetchRecordings(){
    const response=await axios.get('http://localhost:4000/show-recordings',{withCredentials:true})
    setRecordings(response?.data?.data)
    console.log(response?.data?.data)
 }

 useEffect(()=>{
  fetchRecordings()
 },[])
if(recordings.length==0){
    return <h1>no Recordings are available</h1>
}
  return (
    <div className='flex flex-wrap align-center  justify-evenly'>
        {recordings.map((x,index)=>{
            return <RecordingCard key={index} data={x}/>
        })}
    </div>
  )
}

export default AllRecordings