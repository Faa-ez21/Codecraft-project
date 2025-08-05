import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Header from '../components/header';
import Footer from '../components/footer';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setErrorMessage(signInError.message || 'Login failed');
        return;
      }

      const userId = signInData?.user?.id;
      if (!userId) {
        setErrorMessage('User ID not found.');
        return;
      }

      // Check if user is an admin
      const { data: adminUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (adminUser) {
        // ✅ Redirect to admin dashboard app (adjust to your port or deployment domain)
        window.location.href = 'http://localhost:5173/';
        return;
      }

      // Check if user is a customer
      const { data: customerUser } = await supabase
        .from('customers')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (customerUser) {
        // ✅ Stay on client site
        navigate('/');
        return;
      }

      setErrorMessage('User not found in users or customers table.');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
            Login to Expert Office
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-green-700 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
