import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/header';
import Footer from '../components/footer';

export default function ProductInquiry() {
  const location = useLocation();
  const { cartItems } = useCart();
  const fromCart = location?.state?.fromCart || false;
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your inquiry has been sent successfully!');
    // Future: Send to Supabase or backend
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      <div className="px-4 md:px-12 lg:px-24 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-green-700 mb-2">
          Home / {fromCart ? 'Cart Inquiry' : 'Services'} / Inquiry
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
          {fromCart ? 'Product Inquiry' : 'Service Inquiry'}
        </h1>

        {/* If from Cart, show cart summary */}
        {fromCart && cartItems.length > 0 && (
          <div className="bg-gray-100 rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Inquired Products</h2>
            <div className="grid gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-3"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl border rounded-xl p-6 md:p-10 space-y-6"
        >
          <h3 className="text-2xl font-semibold">Send Us Your Inquiry</h3>

          <div>
            <label className="block text-sm font-medium text-gray-800">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Message</label>
            <textarea
              name="message"
              rows="4"
              required
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder={
                fromCart
                  ? 'Write any specifications or questions about the selected items...'
                  : 'Tell us how we can assist you with our services...'
              }
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Submit Inquiry
          </button>
        </form>

        {/* Back Buttons */}
        <div className="mt-8 flex gap-4">
          <Link to="/shop">
            <button className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition">
              ← Back to Products
            </button>
          </Link>
          <Link to="/services">
            <button className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition">
              ← Back to Services
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
