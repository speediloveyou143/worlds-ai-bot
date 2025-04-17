
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer';
import { BACKEND_URL } from '../../../config/constant';


const Careers = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationEmail, setApplicationEmail] = useState('ishowspeedindia6@gmail.com');

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Pay',
      description: 'Industry-leading compensation with performance bonuses',
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: 'Annual budget for courses, conferences, and certifications',
    },
    {
      icon: '🏥',
      title: 'Health Benefits',
      description: 'Comprehensive health, dental, and vision coverage',
    },
    {
      icon: '⚖️',
      title: 'Work-Life Balance',
      description: 'Flexible working hours and remote work options',
    },
  ];

  useEffect(() => {
    // Fetch email for open application
    const fetchApplicationEmail = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/all-contacts`);
        const data = response.data[0]; // Take the first item
        if (data && data.email) {
          setApplicationEmail(data.email);
        }
      } catch (error) {
        console.error('Error fetching application email:', error);
        // Keep default email if API fails
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/show-jobs`, {
          withCredentials: true,
        });
        const jobData = [
          {
            department: 'Tech Excellence, Development & Research Department',
            roles: response.data.map((job) => ({
              title: job.jobRole,
              type: 'Full-time/Part-time',
              location: job.workType.charAt(0).toUpperCase() + job.workType.slice(1),
              experience: job.experience,
            })),
          },
        ];
        setDepartments(jobData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch job openings.');
        setLoading(false);
      }
    };

    fetchApplicationEmail();
    fetchJobs();
  }, []);

  const handleApply = (role) => {
    const email = applicationEmail; // Use the dynamic email from API
    const subject = `Application for ${role.title} Position 🎉`;
    const body = `Dear Hiring Manager, 🌟\n\nI’m super excited 😊 to apply for the **${role.title}** position at your company! Here are the details of the role I’m applying for:\n\n- **Job Role**: ${role.title} 🚀\n- **Type**: ${role.type} ⏰\n- **Location**: ${role.location} 📍\n- **Experience Required**: ${role.experience} ⭐\n\nI’m thrilled about the chance to join your team and bring my skills to the table! **Please attach your resume** 📄 to showcase your experience—it’d be awesome to see what you’ve got! Feel free to let me know if you need any more info. 🙌\n\nThis opportunity looks amazing, and I can’t wait to hear from you! Thanks for considering me! 😎\n\nBest regards,\n[Your Name] ✍️\n[Your Contact Information] 📞`;
  
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleOpenApplication = () => {
    const email = applicationEmail; // Dynamic email from API
    const subject = `Open Application - Ready to Shine! ✨`;
    const body = `Dear Hiring Manager, 🌟\n\nI’m reaching out with enthusiasm 😊 because I’d love to join your incredible team! I might not have a specific role in mind, but I’m packed with skills and ready to make an impact wherever I’m needed! 🚀\n\n**Please attach your resume** 📄 — I’ve got a dazzling showcase of my experience waiting for you! I’m eager to contribute to your mission and bring some sparkle to the table. Let me know how I can fit in or if you need more details! 🌈\n\nThanks for taking a look—this feels like the start of something amazing! 🙌\n\nWarm regards,\n[Your Name] ✍️\n[Your Contact Information] 📞`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Open Application Section */}
      <div className="py-6 sm:py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Don’t See Your Perfect Role?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            We’re always looking for talented individuals. Send us your resume and let us know how you can contribute to our mission.
          </p>
          <button
            onClick={handleOpenApplication}
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
            type="button"
          >
            Send Open Application
          </button>
        </div>
      </div>
      <hr className="mx-[70px] border-[3px] hidden sm:block" />

      {/* Open Positions Section */}
      <div className="py-10 sm:py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a004730,transparent)] animate-pulse pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Open positions at other companies
          </h2>
          <div className="space-y-8 sm:space-y-12">
            {loading ? (
              <p className="text-center text-gray-300">Loading job openings...</p>
            ) : error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : departments.length > 0 ? (
              departments.map((department, index) => (
                <div key={index} className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-4 sm:mb-6">
                    {department.department}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {department.roles.map((role, roleIndex) => (
                      <div
                        key={roleIndex}
                        className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-blue-800/30 hover:border-blue-600/50 transition-all pointer-events-auto"
                      >
                        <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {role.title}
                        </h4>
                        <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                          <div className="flex items-center text-gray-300">
                            <span className="text-xs sm:text-sm">🕒 {role.type}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <span className="text-xs sm:text-sm">📍 {role.location}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <span className="text-xs sm:text-sm">⭐ {role.experience}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleApply(role)}
                          className="w-full py-2 rounded-lg border border-blue-800/50 hover:bg-blue-900/50 transition-all text-xs sm:text-sm cursor-pointer focus:outline-none pointer-events-auto"
                          type="button"
                        >
                          Apply Now →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-300">No job openings available at the moment.</p>
            )}
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-10 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-blue-950/20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Join Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-blue-800/30 hover:border-blue-600/50 transition-all pointer-events-auto"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;