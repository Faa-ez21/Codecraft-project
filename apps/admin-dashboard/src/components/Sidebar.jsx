import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  FileText,
  List,
  UserCheck,
  BarChart2,
  Percent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Sidebar() {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md p-5 overflow-y-auto">
      {/* Logo and Name */}
      <div className="flex items-center gap-3 mb-10 border-b pb-5 border-gray-200 dark:border-gray-700">
        <img
          src="/pics/Company logo.png"
          alt="Logo"
          className="h-12 w-12 object-cover rounded-full"
        />
        <span className="text-xl font-bold text-green-600 leading-tight">
          Expert Office Furnish
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-4 text-gray-700 dark:text-gray-300">
        <NavLink to="/" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink to="/products" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <Box size={20} /> Products
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <ShoppingCart size={20} /> Orders
        </NavLink>

        <NavLink to="/users" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <Users size={20} /> Users
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <List size={20} /> Categories
        </NavLink>

        <NavLink to="/content" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <FileText size={20} /> Content Management
        </NavLink>

        <NavLink to="/customers" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <UserCheck size={20} /> Customers
        </NavLink>

        {/* Analytics Dropdown */}
        <button
          onClick={() => setAnalyticsOpen(!analyticsOpen)}
          className="flex items-center gap-3 w-full hover:text-green-600 focus:outline-none"
        >
          <BarChart2 size={20} />
          <span className="flex-1 text-left">Analytics</span>
          {analyticsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {analyticsOpen && (
          <div className="ml-6 space-y-2">
            <NavLink to="/analytics" className={({ isActive }) =>
              `block hover:text-green-600 text-sm ${
                isActive ? "text-green-600 font-semibold" : ""
              }`
            }>
              Overview
            </NavLink>
            <NavLink to="/analytics/sales-performance" className={({ isActive }) =>
              `block hover:text-green-600 text-sm ${
                isActive ? "text-green-600 font-semibold" : ""
              }`
            }>
              Sales Performance
            </NavLink>
            <NavLink to="/analytics/top-products" className={({ isActive }) =>
              `block hover:text-green-600 text-sm ${
                isActive ? "text-green-600 font-semibold" : ""
              }`
            }>
              Top Products
            </NavLink>
            <NavLink to="/analytics/user-behavior" className={({ isActive }) =>
              `block hover:text-green-600 text-sm ${
                isActive ? "text-green-600 font-semibold" : ""
              }`
            }>
              User Behavior
            </NavLink>
          </div>
        )}

        <NavLink to="/discounts" className={({ isActive }) =>
          `flex items-center gap-3 hover:text-green-600 ${
            isActive ? "text-green-600 font-semibold" : ""
          }`
        }>
          <Percent size={20} /> Discounts
        </NavLink>
      </nav>
    </aside>
  );
}
