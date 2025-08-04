import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Header from '../components/header';
import Footer from '../components/footer';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_CODE = 'ADMIN2025'; // Move to .env in production

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErrorMessage(error.message || 'Signup failed.');
      console.error('Signup error:', error.message);
      setLoading(false);
      return;
    }

    const user = data?.user;
    const userId = user?.id;

    if (!userId) {
      setErrorMessage('No user ID returned after sign up.');
      setLoading(false);
      return;
    }

    try {
      if (form.adminCode === ADMIN_CODE) {
        // Admin signup
        const { error: adminInsertError } = await supabase.from('users').insert([{
          id: userId,
          name: form.name,
          email: form.email,
          role: 'admin', // or 'staff'
          status: 'active',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          permissions: {},
        }]);

        if (adminInsertError) {
          console.error('Error inserting admin user:', adminInsertError.message);
          setErrorMessage('Account created, but failed to assign admin role.');
          setLoading(false);
          return;
        }
      } else {
        // Customer signup
        const { error: customerInsertError } = await supabase.from('customers').insert([{
          id: userId,
          name: form.name,
          email: form.email,
          phone: '',
          location: '',
          orders: 0,
          spent: 0,
        }]);

        if (customerInsertError) {
          console.error('Error inserting customer:', customerInsertError.message);
          setErrorMessage('Account created, but failed to set up customer info.');
          setLoading(false);
          return;
        }
      }

      // If email confirmation is enabled, show notice
      if (!user?.email_confirmed_at) {
        setInfoMessage('Account created! Please check your email to confirm your address.');
      } else {
        // Auto-login and redirect only if email is already confirmed (dev mode)
        navigate('/login');
      }
    } catch (e) {
      console.error('Unexpected signup error:', e);
      setErrorMessage('Unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Create an Account</h2>

          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm text-center">{errorMessage}</div>
          )}

          {infoMessage && (
            <div className="mb-4 text-blue-600 text-sm text-center">{infoMessage}</div>
          )}

          {loading ? (
            <div className="text-center text-green-700 py-4">Creating account...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-800"
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-800"
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-800"
                disabled={loading}
              />
              <input
                type="text"
                name="adminCode"
                value={form.adminCode}
                placeholder="Admin Code (optional)"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg text-gray-800"
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}

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
