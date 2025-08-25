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
    }, 3000); // Reduced to 3 seconds for faster UX

    return () => clearTimeout(maxLoadingTime);
  }, [loading]);

  // Function to determine user type and fetch details
  const fetchUserDetails = async (sessionUser) => {
    try {
      // First check if user is an admin in users table
      const { data: adminData, error: adminError } = await supabase
        .from("users")
        .select("role, name, status")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (adminData && !adminError) {
        // User is an admin/staff member
        setUser((prev) => ({
          ...prev,
          role: adminData.role,
          name: adminData.name,
          status: adminData.status,
          userType: "admin",
        }));
        return;
      }

      // Check if user is a customer
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("name, email, phone, location, orders, spent")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (customerData && !customerError) {
        // User is a customer
        setUser((prev) => ({
          ...prev,
          role: "customer",
          name: customerData.name,
          phone: customerData.phone,
          location: customerData.location,
          orders: customerData.orders,
          spent: customerData.spent,
          userType: "customer",
        }));
        return;
      }

      // If neither exists, this is a new user - create customer profile
      // The database trigger should handle this, but as fallback:
      if (!customerData && !adminData) {
        const { error: insertError } = await supabase.from("customers").upsert(
          {
            id: sessionUser.id,
            name:
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0] ||
              "Customer",
            email: sessionUser.email,
            phone: null,
            location: null,
            orders: 0,
            spent: 0,
          },
          {
            onConflict: "id",
          }
        );

        if (!insertError) {
          setUser((prev) => ({
            ...prev,
            role: "customer",
            name:
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0] ||
              "Customer",
            phone: null,
            location: null,
            orders: 0,
            spent: 0,
            userType: "customer",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Set basic user info as fallback
      setUser((prev) => ({
        ...prev,
        role: "customer",
        name:
          sessionUser.user_metadata?.name ||
          sessionUser.email?.split("@")[0] ||
          "User",
        userType: "customer",
      }));
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setUser(null);
          setLoading(false);
          return;
        }

        const sessionUser = data?.session?.user ?? null;

        if (sessionUser) {
          // Set user immediately with basic info
          setUser({
            ...sessionUser,
            role: "customer", // Default role until we fetch details
            name:
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0] ||
              "User",
            userType: "customer",
          });

          // Fetch detailed user info
          await fetchUserDetails(sessionUser);
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Session retrieval failed:", error);
        setUser(null);
        setLoading(false);
      }
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Set user immediately for responsiveness
          setUser({
            ...session.user,
            role: "customer", // Default role
            name:
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "User",
            userType: "customer",
          });

          // Fetch detailed user info in background
          await fetchUserDetails(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
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
