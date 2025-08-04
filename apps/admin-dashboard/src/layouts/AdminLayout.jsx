import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function AdminLayout({ children, toggleDarkMode, darkMode }) {
  const [userInitial, setUserInitial] = useState("?");

  useEffect(() => {
    const fetchUserInitial = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData?.session?.user?.email;

      if (userEmail) {
        const { data: userData } = await supabase
          .from("users")
          .select("name")
          .eq("email", userEmail)
          .single();

        if (userData?.name) {
          setUserInitial(userData.name.charAt(0).toUpperCase());
        }
      }
    };

    fetchUserInitial();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Sidebar />

        <div className="flex-1 ml-64">
          <Navbar
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            userInitial={userInitial}
          />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
