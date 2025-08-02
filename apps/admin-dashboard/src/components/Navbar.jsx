// src/components/Navbar.jsx
import { Bell, Search, Sun, Moon } from "lucide-react";

export default function Navbar({ toggleDarkMode, darkMode }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow transition-colors duration-300">
      {/* Search */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none px-2 text-gray-700 dark:text-gray-200"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>
        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        <img
          src="/pics/user-avatar.png"
          alt="Profile"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
}
