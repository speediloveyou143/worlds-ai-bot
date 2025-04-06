
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='z-index-[-10] pb-5'>
      <footer className="bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                WorldsAi Bot
              </h3>
              <p className="text-gray-400">
                Transforming careers through AI-powered education and mentorship.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: '🌐', name: 'Website' },
                  { icon: '💼', name: 'LinkedIn' },
                  { icon: '🐦', name: 'Twitter' },
                  { icon: '📸', name: 'Instagram' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 flex items-center justify-center border border-purple-500/20 hover:scale-110 transition-transform"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Courses</a></li>
                <Link to="/privacy-policy"><li className="hover:text-purple-400 transition-colors">privacy Policy</li></Link>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Resources
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Career Tips</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Student Reviews</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Contact Us
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@worldsaibot.com</li>
                <li>+91 1234567890</li>
                <li>Mon - Fri: 9AM - 6PM</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 WorldsAi Bot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;