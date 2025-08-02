import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 text-sm border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-4 text-center">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-green-800">About Us</a>
          <a href="#" className="hover:text-green-800">Contact</a>
          <a href="#" className="hover:text-green-800">FAQ</a>
          <a href="#" className="hover:text-green-800">Privacy Policy</a>
          <a href="#" className="hover:text-green-800">Terms of Service</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-yellow-600 text-lg">
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © 2025 Expert Office Furnish Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported
