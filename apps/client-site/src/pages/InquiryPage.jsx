import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";

export default function ProductInquiry() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inquiry sent successfully!');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
    <div className="bg-[#f9fafb] min-h-screen px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-green-700 mb-2">
          Home / Office Chairs / Inquiry
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-black-800 mb-6">
          Product And Service Inquiry
        </h1>

        {/* Product Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-10 flex flex-col md:flex-row gap-6">
          <img
            src="https://images.unsplash.com/photo-1598300053181-72d04f38011a"
            alt="Product"
            className="w-full md:w-1/3 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black-900">Ergonomic Office Chair</h2>
            <p className="text-gray-600 mt-4">
              Comfortable mesh chair with lumbar support and adjustable height.
              Perfect for long work hours and maintaining good posture.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold text-black-800">Send us an inquiry</h3>

          <div>
            <label className="block text-sm font-medium text-black-900">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black-900">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black-900">Message</label>
            <textarea
              name="message"
              rows="4"
              required
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-green-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Let us know how we can assist you..."
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg shadow"
          >
            Send Inquiry
          </button>
        </form>

        {/* Back Button */}
        <div className="mt-6">
          <Link to="/shop">
            <button className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-500 transition">
              ← Back to Products
            </button>
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}
