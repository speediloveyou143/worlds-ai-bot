
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function BuyNow() {
  const { id, courseId } = useParams(); // `id` for roadmap, `courseId` for course details
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);

  const { user } = useSelector((state) => state.user);
  const { _id, name, email } = user || {};

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/show-roadmap/${id}`
        );
        setRoadmapData(response.data);
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
    };

    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/show-course/${courseId}`
        );
        setCourseData(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchRoadmapData();
    fetchCourseData();
  }, [id, courseId]);

  const handlePayment = () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (!courseData) {
      alert("Course details not loaded. Please try again later.");
      return;
    }

    const { courseName, price, imageUrl, recordingId } = courseData;

    const options = {
      key: "rzp_test_J6YU5UDuMKPdrW",
      amount: price * 100, // Using the price from the fetched course data
      currency: "INR",
      name: "World's AI Bot",
      description: courseName,
      image: imageUrl,
      handler: async function (response) {
        const paymentData = {
          courses: [
            {
              transactionId: response.razorpay_payment_id,
              amount: price,
              status: true,
              email: email,
              name: name,
              courseName: courseName,
              recordingsId: recordingId,
            },
          ],
        };

        try {
          const putResponse = await axios.put(
            `http://localhost:4000/update-user/${_id}`,
            paymentData
          );
          alert(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
        } catch (error) {
          console.error("Error saving payment data:", error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      alert(`Payment failed! Reason: ${response.error.description}`);
    });
    razorpay.open();
  };

  return (
    <div className="flex">
      {/* Roadmap Section */}
      <div className="w-2/3 bg-base-200 p-7 rounded-2xl border-2 border-sky-500">
        {roadmapData && (
          <>
            <h1 className="text-4xl font-medium">{roadmapData.courseName}</h1>
            {roadmapData.skills.map((skill, index) => (
              <div
                key={index}
                className="collapse collapse-arrow bg-base-200 mt-4 border-2 border-gray-300 rounded-lg"
              >
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">
                  {skill.skillName}
                </div>
                <div className="collapse-content">
                  <ul>
                    {skill.subTopics.map((subTopic, subIndex) => (
                      <li key={subIndex}>{subTopic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Course Details & Payment Section */}
      <div className="w-1/3 p-7">
        {courseData ? (
          <>
            <h1 className="text-2xl font-bold">{courseData.courseName}</h1>
            <img
              src={courseData.imageUrl}
              alt={courseData.courseName}
              className="rounded-lg mt-3"
            />
            <h2 className="text-xl mt-2">Price: ₹{courseData.price}</h2>
            <p>Duration: {courseData.duration} hours</p>
            <button
              className="btn w-full mt-3 btn-info"
              onClick={handlePayment}
            >
              Buy Now
            </button>
          </>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
    </div>
  );
}

export default BuyNow;
