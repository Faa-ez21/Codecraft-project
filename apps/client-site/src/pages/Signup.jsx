import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Header from '../components/header';
import Footer from '../components/footer';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); // Removed role
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      console.error('Signup error:', error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      console.error('No user ID returned after sign up.');
      return;
    }

    // By default, all signups are customers
    await supabase.from('customers').insert([{
      id: userId,
      name: form.name,
      email: form.email,
      phone: '',
      location: '',
      orders: 0,
      spent: 0
    }]);

    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-800"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-800"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-800"
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-green-700 hover:underline">Log in</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
