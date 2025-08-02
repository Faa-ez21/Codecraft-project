import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children, toggleDarkMode, darkMode }) {
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Navbar */}
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
