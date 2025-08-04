import { Bell, Search } from "lucide-react";

export default function Navbar({ toggleDarkMode, darkMode, userInitial }) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow">
      <div className="text-gray-800 dark:text-white text-xl font-semibold">
        Admin Dashboard
      </div>
      <div className="flex items-center gap-4">
        <Search size={18} className="text-gray-500 dark:text-gray-300" />
        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        <div className="w-9 h-9 bg-green-700 text-white flex items-center justify-center rounded-full font-bold uppercase">
          {userInitial || "?"}
        </div>
      </div>
    </div>
  );
}
