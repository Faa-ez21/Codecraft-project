import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session on load
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) setUser(data?.session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // Listen for auth changes (login, logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : <div className="text-center py-16">Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth in components
export const useAuth = () => useContext(AuthContext);
