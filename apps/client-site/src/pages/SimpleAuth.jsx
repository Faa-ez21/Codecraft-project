import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SimpleAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Attempting login...");

    try {
      console.log("Starting login process...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        setMessage(`Login failed: ${error.message}`);
      } else {
        console.log("Login successful:", data);
        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setMessage(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Creating account...");

    try {
      console.log("Starting signup process...");

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      console.log("Signup response:", { data, error });

      if (error) {
        console.error("Signup error:", error);
        setMessage(`Signup failed: ${error.message}`);
      } else {
        console.log("Signup successful:", data);

        if (data.user) {
          // Try to create customer record
          const { error: dbError } = await supabase.from("customers").insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              phone: "",
              location: "",
              orders: 0,
              spent: 0,
            },
          ]);

          if (dbError) {
            console.error("Database insert error:", dbError);
            setMessage(
              `Account created but database error: ${dbError.message}`
            );
          } else {
            setMessage(
              "Account created successfully! Please check your email or try logging in."
            );
          }
        } else {
          setMessage("Account created but no user data returned.");
        }
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setMessage(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setMessage("Testing connection...");

    try {
      const { data, error } = await supabase
        .from("customers")
        .select("count", { count: "exact", head: true });

      if (error) {
        setMessage(`Connection test failed: ${error.message}`);
      } else {
        setMessage("Connection test successful!");
      }
    } catch (err) {
      setMessage(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Simple Auth Test
        </h1>

        <div className="mb-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            Test Connection
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSignup}
              onChange={(e) => setIsSignup(e.target.checked)}
              className="mr-2"
            />
            Signup Mode
          </label>
        </div>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={isSignup}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isSignup ? "Creating Account..." : "Logging In..."}
              </span>
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
