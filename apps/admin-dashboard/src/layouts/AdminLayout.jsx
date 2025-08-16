import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function AdminLayout({ children, toggleDarkMode, darkMode }) {
  const [userInitial, setUserInitial] = useState("?");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <div className="flex bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <Navbar
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            userInitial={userInitial}
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
