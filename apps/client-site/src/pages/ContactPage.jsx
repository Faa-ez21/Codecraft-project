import React from "react";
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";

export default function ContactPage() {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen font-sans">
      {/* Header */}
      <Header />

      {/* Contact Section */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-1">Contact Us</h2>
        <p className="text-sm text-gray-500 mb-8">We're here to help. Reach out to us with any questions or inquiries.</p>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input type="text" placeholder="Enter your name" className="w-full p-3 rounded bg-gray-900 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium">Your Email</label>
            <input type="email" placeholder="Enter your email" className="w-full p-3 rounded bg-gray-900 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input type="text" placeholder="Enter the subject" className="w-full p-3 rounded bg-gray-900 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea rows="5" placeholder="" className="w-full p-3 rounded bg-gray-900 text-white"></textarea>
          </div>
          <button type="submit" className="bg-green-800 text-white px-5 py-2 rounded-full text-sm">Send Message</button>
        </form>

        {/* Location Info */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Our Location</h3>
          <address className="not-italic text-sm text-gray-700 leading-relaxed">
            Expert Office Furnish<br />
            123 Business Avenue<br />
            Suite 456<br />
            Cityville, State 78901<br />
            <br />
            Phone: (555) 123–4567<br />
            Email: support@expertofficefurnish.com
          </address>

          {/* Socials */}
          <div className="flex space-x-6 mt-4">
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6 rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Map"
            className="w-full h-64 border-0"
            src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Des+Moines,IA"
            allowFullScreen
          ></iframe>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
