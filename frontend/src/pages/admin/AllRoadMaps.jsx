import React from 'react'
import axios from "axios"
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
function RoadMapCard(props){
    async function handleDelete() {
        try {
          if (window.confirm("are you sure you want to delete this course?")) {
            const response = await axios.delete(
              `http://localhost:4000/delete-roadmap/${props.data._id}`,
              { withCredentials: true }
            );
            if (response.status === 200) {
              alert("roadmap deleted successfully!");
              window.location.reload()
            } else {
              alert("Failed to delete the roadmap.");
            }
          }
        } catch (error) {
          console.log("Error deleting course:", error);
          alert("An error occurred while deleting the roadmap.");
        }
      }
    return <div className="card bg-[#16191F] text-white my-2 ">
    <div className="card-body items-center text-center">
      <h2 className="card-title">{props.data.courseName}</h2>
      <p>{props.data._id}</p>
      <div className="card-actions justify-end">
        <Link to={"/admin-dashboard/profile/update-road-map/"+props.data._id}><button className="badge rounded py-4 px-4 bg-success text-black">Update</button></Link>
        <button className="badge rounded py-4 px-4 bg-error text-black" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  </div>
}
function AllRoadMaps() {
 const [roadMap,setRoadMap]=useState([])
 async function fetchRoadMap(){
    const response=await axios.get('http://localhost:4000/show-roadmaps',{withCredentials:true})
    setRoadMap(response?.data)
 }

 useEffect(()=>{
    fetchRoadMap()
 },[])
if(roadMap.length==0){
    return <h1>no RoadMaps are available</h1>
}
  return (
    <div className='flex flex-wrap align-center  justify-evenly'>
        {roadMap.map((x,index)=>{
            return <RoadMapCard key={index} data={x}/>
        })}
    </div>
  )
}

export default AllRoadMaps