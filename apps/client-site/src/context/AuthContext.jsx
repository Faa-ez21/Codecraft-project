import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set a maximum loading time to prevent infinite loading
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      if (loading) {
        console.log("Auth loading timeout - setting loading to false");
        setLoading(false);
      }
    }, 3000); // Maximum 3 seconds loading

    return () => clearTimeout(maxLoadingTime);
  }, [loading]);

  // Background function to fetch user details without blocking login
  const fetchUserDetails = async (sessionUser) => {
    try {
      // Use Promise.allSettled to run both queries in parallel
      const [adminResult, customerResult] = await Promise.allSettled([
        supabase
          .from("users")
          .select("role, name")
          .eq("id", sessionUser.id)
          .single(),
        supabase
          .from("customers")
          .select("name, email, phone, location")
          .eq("id", sessionUser.id)
          .single(),
      ]);

      // Check admin result first
      if (adminResult.status === "fulfilled" && adminResult.value.data) {
        setUser((prev) => ({
          ...prev,
          role: adminResult.value.data.role,
          name: adminResult.value.data.name,
        }));
        return;
      }

      // Check customer result
      if (customerResult.status === "fulfilled" && customerResult.value.data) {
        setUser((prev) => ({
          ...prev,
          role: "customer",
          name: customerResult.value.data.name,
        }));
        return;
      }

      // If customer doesn't exist, create them
      if (
        customerResult.status === "rejected" &&
        customerResult.reason?.code === "PGRST116"
      ) {
        const { error: insertError } = await supabase.from("customers").insert({
          id: sessionUser.id,
          name:
            sessionUser.user_metadata?.name ||
            sessionUser.email?.split("@")[0] ||
            "",
          email: sessionUser.email,
          phone: "",
          location: "",
          orders: 0,
          spent: 0,
        });

        if (!insertError) {
          setUser((prev) => ({
            ...prev,
            role: "customer",
            name:
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0] ||
              "",
          }));
        }
      }
    } catch (error) {
      console.log("Background user details fetch failed:", error);
      // User is already set with basic info, so login still works
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user ?? null;

      if (sessionUser) {
        // Set user immediately with basic info to speed up login
        setUser({
          ...sessionUser,
          role: "customer", // Default role
          name:
            sessionUser.user_metadata?.name ||
            sessionUser.email?.split("@")[0] ||
            "",
        });
        setLoading(false);

        // Then fetch additional data in background without blocking
        fetchUserDetails(sessionUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Set user immediately to speed up auth
          setUser({
            ...session.user,
            role: "customer", // Default role
            name:
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "",
          });

          // Fetch details in background
          fetchUserDetails(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
