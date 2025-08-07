import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Ignore "No rows found" error (code: PGRST116)
        throw checkError;
      }

      if (existing) {
        setError('This email is already subscribed.');
        setLoading(false);
        return;
      }

      // Insert new subscriber
      const { error: insertError } = await supabase.from('subscribers').insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err.message);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-yellow-50 text-gray-900">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white shadow-2xl rounded-2xl border border-green-300 max-w-xl w-full p-8 sm:p-10 transition-all duration-500">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
            📬 Stay Informed. Stay Inspired.
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Subscribe to our newsletter and get the latest ergonomic tips, office design ideas, and exclusive offers.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 text-green-700">
              <CheckCircle className="w-12 h-12" />
              <p className="text-lg font-semibold text-center">
                Thank you for subscribing! 🎉
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition-all"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600 font-medium">
                  <XCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
