import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    console.log('Subscribed:', email);
    setSubmitted(true);
    setEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      {/* Main content container */}
      <main className="flex-1">
        <div className="bg-green-50 py-10 px-6 rounded-lg shadow-md max-w-2xl mx-auto mt-16 border border-green-300">
          <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">
            Subscribe for Newsletters
          </h2>

          {submitted ? (
            <p className="text-green-900 text-center text-lg font-medium">
              🎉 Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-4 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-600 transition"
              >
                Subscribe
              </button>
            </form>
          )}

          {error && (
            <p className="text-red-600 mt-3 text-center font-medium">{error}</p>
          )}
        </div>
      </main>

      {/* Pushes footer to the bottom when content is short */}
      <Footer />
    </div>
  );
}
