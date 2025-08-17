import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function DebugAuth() {
  const [status, setStatus] = useState("Testing connection...");
  const [authStatus, setAuthStatus] = useState("Not checked");
  const [dbStatus, setDbStatus] = useState("Not checked");
  const [testResults, setTestResults] = useState([]);

  const addResult = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults((prev) => [...prev, { message, type, timestamp }]);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus("Testing Supabase connection...");
    addResult("Starting Supabase connection test...", "info");

    try {
      // Test 1: Basic connection
      addResult("Testing basic Supabase connection...", "info");
      const { data, error } = await supabase
        .from("customers")
        .select("count", { count: "exact", head: true });

      if (error) {
        addResult(`Database connection error: ${error.message}`, "error");
        setDbStatus("Failed");
      } else {
        addResult("Database connection successful!", "success");
        setDbStatus("Connected");
      }

      // Test 2: Auth connection
      addResult("Testing auth connection...", "info");
      const { data: authData, error: authError } =
        await supabase.auth.getSession();

      if (authError) {
        addResult(`Auth connection error: ${authError.message}`, "error");
        setAuthStatus("Failed");
      } else {
        addResult("Auth connection successful!", "success");
        setAuthStatus("Connected");
      }

      // Test 3: Environment variables
      addResult("Checking environment variables...", "info");
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        addResult("Environment variables missing!", "error");
      } else {
        addResult(`URL: ${supabaseUrl.substring(0, 30)}...`, "success");
        addResult(`Key: ${supabaseKey.substring(0, 30)}...`, "success");
      }

      setStatus("Connection test completed");
    } catch (error) {
      addResult(`Unexpected error: ${error.message}`, "error");
      setStatus("Connection test failed");
    }
  };

  const testSignup = async () => {
    addResult("Testing signup process...", "info");

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = "test123456";

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        addResult(`Signup error: ${error.message}`, "error");
      } else {
        addResult(`Signup successful! User ID: ${data.user?.id}`, "success");

        // Test database insertion
        if (data.user?.id) {
          const { error: dbError } = await supabase.from("customers").insert([
            {
              id: data.user.id,
              name: "Test User",
              email: testEmail,
              phone: "",
              location: "",
              orders: 0,
              spent: 0,
            },
          ]);

          if (dbError) {
            addResult(`Database insert error: ${dbError.message}`, "error");
          } else {
            addResult("Database record created successfully!", "success");
          }
        }
      }
    } catch (error) {
      addResult(`Signup test error: ${error.message}`, "error");
    }
  };

  const testLogin = async () => {
    addResult("Testing login process...", "info");

    try {
      // First create a test user
      const testEmail = `login-test-${Date.now()}@example.com`;
      const testPassword = "test123456";

      // Sign up first
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
        });

      if (signupError) {
        addResult(
          `Signup for login test failed: ${signupError.message}`,
          "error"
        );
        return;
      }

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now try to login
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

      if (loginError) {
        addResult(`Login error: ${loginError.message}`, "error");
      } else {
        addResult(
          `Login successful! User: ${loginData.user?.email}`,
          "success"
        );
      }
    } catch (error) {
      addResult(`Login test error: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Supabase Debug Tool
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Connection Status</h3>
              <p className="text-blue-600">{status}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Database</h3>
              <p className="text-green-600">{dbStatus}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Authentication</h3>
              <p className="text-purple-600">{authStatus}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Connection
            </button>
            <button
              onClick={testSignup}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Signup
            </button>
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Login
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Test Results:</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    result.type === "error"
                      ? "bg-red-100 text-red-800"
                      : result.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <span className="text-xs text-gray-500">
                    [{result.timestamp}]
                  </span>{" "}
                  {result.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
