import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
            Create an Account
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
            >
              Sign Up
            </button>
            <p className="text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-green-700 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
