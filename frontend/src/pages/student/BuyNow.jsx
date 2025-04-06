import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function BuyNow() {
  const { id, courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isPaymentSectionVisible, setIsPaymentSectionVisible] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { _id, name, email } = user || {};

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/show-roadmap/${id}`);
        setRoadmapData(response.data);
      } catch (error) {
        // Handle error silently
      }
    };

    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/show-course/${courseId}`);
        setCourseData(response.data);
      } catch (error) {
        // Handle error silently
      }
    };

    fetchRoadmapData();
    fetchCourseData();
  }, [id, courseId]);

  useEffect(() => {
    const handleScroll = () => {
      const paymentSection = document.getElementById("payment-section");
      if (paymentSection) {
        const rect = paymentSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsPaymentSectionVisible(true);
        } else {
          setIsPaymentSectionVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateTotal = () => {
    if (!courseData) return 0;
    const gst = courseData.price * 0.18;
    return courseData.price + gst;
  };

  const handlePayment = () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (!courseData) {
      alert("Course details not loaded. Please try again later.");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions to proceed.");
      return;
    }

    const { courseName, price, imageUrl, recordingId } = courseData;
    const totalAmount = calculateTotal();

    const options = {
      key: "rzp_test_J6YU5UDuMKPdrW",
      amount: totalAmount * 100,
      currency: "INR",
      name: "World's AI Bot",
      description: courseName,
      image: imageUrl,
      handler: async function (response) {
        const paymentData = {
          courses: [
            {
              transactionId: response.razorpay_payment_id,
              amount: totalAmount,
              status: true,
              email: email,
              name: name,
              courseName: courseName,
              recordingsId: recordingId,
            },
          ],
        };

        try {
          await axios.put(`http://localhost:4000/update-user/${_id}`, paymentData);
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        } catch (error) {
          // Handle error silently
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

  const scrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-2 lg:p-8 bg-gradient-to-br from-gray-950 via-black to-blue-950 min-h-screen text-white">
      <div className="w-full lg:w-2/3 bg-gray-900 p-2 lg:p-8 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-2xl border border-gray-800 overflow-y-auto max-h-screen">
        {roadmapData && (
          <>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-2 lg:p-6 rounded-lg lg:rounded-t-2xl">
              <h1 className="text-xl lg:text-4xl font-bold text-white">{roadmapData.courseName}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mt-2 lg:mt-6">
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <div className="flex items-center gap-2 lg:gap-4">
                  <div>
                    <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Project-Based Learning</h2>
                    <p className="mt-1 lg:mt-2 text-gray-300">Hands-on projects to solidify your skills.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Live Classes</h2>
                <p className="mt-1 lg:mt-2 text-gray-300">Duration: {roadmapData.duration} hours</p>
              </div>
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Lifetime Recording Access</h2>
                <p className="mt-1 lg:mt-2 text-gray-300">Revisit lessons anytime, anywhere.</p>
              </div>
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <h2 className="text-lg lg:text-xl font-semibold text-purple-400">24x7 Doubt Solving</h2>
                <p className="mt-1 lg:mt-2 text-gray-300">Get your queries resolved instantly.</p>
              </div>
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Certification</h2>
                <p className="mt-1 lg:mt-2 text-gray-300">Earn a certificate upon course completion.</p>
              </div>
              <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
                <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Free Internship</h2>
                <p className="mt-1 lg:mt-2 text-gray-300">Get free internship opportunity</p>
              </div>
            </div>
            <div className="mt-4 lg:mt-8">
              <h2 className="text-lg lg:text-2xl font-bold text-white">Skills You'll Learn</h2>
              {roadmapData.skills.map((skill, index) => (
                <div key={index} className="collapse collapse-arrow bg-gray-800 mt-2 lg:mt-4 border border-gray-700 rounded-lg shadow-lg">
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title text-lg lg:text-xl font-medium text-purple-400">
                    {skill.skillName}
                  </div>
                  <div className="collapse-content">
                    <ul className="list-disc pl-4 lg:pl-6 text-gray-300">
                      {skill.subTopics.map((subTopic, subIndex) => (
                        <li key={subIndex}>{subTopic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 lg:mt-8 bg-gray-800 p-2 lg:p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-center gap-2 lg:gap-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Tutor"
                  className="w-16 h-16 lg:w-24 lg:h-24 rounded-lg border-2 border-purple-500 object-cover"
                />
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold text-purple-400">Tutor Name</h2>
                  <p className="mt-1 lg:mt-2 text-gray-300">Tutor description goes here. This is a brief description of the tutor's experience and expertise.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div id="payment-section" className="w-full lg:w-1/3 bg-gray-900 p-2 lg:p-8 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-2xl border border-gray-800 lg:sticky lg:top-8 bottom-0">
        {courseData ? (
          <>
            <h1 className="text-lg lg:text-2xl font-bold text-white">{courseData.courseName}</h1>
            <img src={courseData.imageUrl} alt={courseData.courseName} className="w-full h-32 lg:h-48 object-cover rounded-lg mt-2 lg:mt-4" />
            <h2 className="text-base lg:text-xl font-semibold text-purple-400 mt-2 lg:mt-4">Price: ₹{courseData.price}</h2>
            <p className="text-gray-300 mt-1 lg:mt-2">GST (18%): ₹{(courseData.price * 0.18).toFixed(2)}</p>
            <p className="text-lg lg:text-xl font-semibold text-purple-400 mt-2 lg:mt-4">Total: ₹{calculateTotal().toFixed(2)}</p>
            <div className="mt-2 lg:mt-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-gray-300">
                I agree to the terms and conditions
              </label>
            </div>
            <button
              className={`w-full mt-2 lg:mt-6 text-white py-2 lg:py-3 rounded-lg font-semibold transition-all shadow-lg ${
                agreeToTerms
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              onClick={handlePayment}
              disabled={!agreeToTerms}
            >
              Buy Now
            </button>
          </>
        ) : (
          <p className="text-gray-300">Loading course details...</p>
        )}
      </div>

      {!isPaymentSectionVisible && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 p-2 shadow-lg border-t border-gray-800 z-50">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50"
            onClick={scrollToPayment}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default BuyNow;
