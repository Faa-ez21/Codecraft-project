import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Header from '../components/header';
import Footer from '../components/footer';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (signInError) {
      console.error('Login error:', signInError.message);
      return;
    }

    const userId = signInData?.user?.id;
    if (!userId) {
      console.error('User ID not found after login.');
      return;
    }

    try {
      // Check if user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', userId)
        .single();

      if (adminUser && !adminError) {
        navigate('/admin/dashboard');
        return;
      }

      // Otherwise check if user is a customer
      const { data: customerUser, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', userId)
        .single();

      if (customerUser && !customerError) {
        navigate('/');
        return;
      }

      console.error('User not found in either users or customers table.');
    } catch (err) {
      console.error('Unexpected login error:', err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Login to Expert Office</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-green-700 hover:underline">Sign up</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
