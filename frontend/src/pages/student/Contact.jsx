import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('http://localhost:4000/send-message', formData);
      if (response.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white">
      <div className="relative py-10 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a004730,transparent)] animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 sm:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Contact Us
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            <div className="p-4 sm:p-8 rounded-xl bg-gray-900/50 border border-blue-800/30 hover:border-blue-600/50 transition-all">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get in Touch
              </h3>
              <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-8">
                Have questions or need assistance? We're here to help! Fill out the form below, and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4 sm:rows-5"
                    className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all transform hover:scale-105"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-3 sm:mt-4 text-green-400 text-center text-sm">
                    Message sent successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mt-3 sm:mt-4 text-red-500 text-center text-sm">
                    Failed to send message. Please try again.
                  </div>
                )}
              </form>
            </div>

            <div className="p-4 sm:p-8 rounded-xl bg-gray-900/50 border border-blue-800/30 hover:border-blue-600/50 transition-all">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50">
                    📍
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-white">Address</p>
                    <p className="text-gray-300 text-sm sm:text-base">123 Tech Street, Innovation City, IC 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50">
                    📞
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-white">Phone</p>
                    <p className="text-gray-300 text-sm sm:text-base">+1 (123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50">
                    ✉️
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-white">Email</p>
                    <p className="text-gray-300 text-sm sm:text-base">support@example.com</p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Follow Us
                  </h4>
                  <div className="flex space-x-3 sm:space-x-4">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50 hover:bg-blue-900/50 transition-all"
                    >
                      🐦
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50 hover:bg-blue-900/50 transition-all"
                    >
                      📸
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-900/30 rounded-lg border border-blue-800/50 hover:bg-blue-900/50 transition-all"
                    >
                      🔗
                    </a>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Visit Us
                  </h4>
                  <div className="w-full h-40 sm:h-48 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2a6c8f4f4f4!2s123%20Tech%20Street%2C%20Innovation%20City%2C%20IC%2012345!5e0!3m2!1sen!2sus!4v1622549400000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;