import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Menu,
  ChevronDown,
  MessageSquare,
  Zap,
  Calendar,
  Mail,
  Package,
  AlertTriangle,
  ShoppingBag,
  Wrench,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar({
  toggleDarkMode,
  darkMode,
  userInitial,
  onSidebarToggle,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    getNotificationIcon,
    getNotificationColor,
  } = useNotifications();

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "mail":
        return <Mail className="w-3 h-3" />;
      case "package":
        return <Package className="w-3 h-3" />;
      case "tool":
        return <Wrench className="w-3 h-3" />;
      case "alert-triangle":
        return <AlertTriangle className="w-3 h-3" />;
      case "shopping-bag":
        return <ShoppingBag className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setShowNotifications(false);

    // Navigate to the action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, inquiries, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200">
                <Calendar className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-200">
                <Zap className="w-4 h-4" />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={refreshNotifications}
                          className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-600/50 transition-colors"
                          title="Refresh notifications"
                        >
                          <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-600/50 transition-colors"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </button>
                        )}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        You have {unreadCount} unread notification
                        {unreadCount !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 cursor-pointer transition-colors ${
                            !notification.read
                              ? "bg-blue-50/50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              {getIconComponent(
                                getNotificationIcon(notification.type)
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4
                                  className={`font-medium text-sm truncate ${
                                    !notification.read
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <span className="text-gray-400 dark:text-gray-500 text-xs">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          No notifications
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <Link
                        to="/notifications"
                        className="block text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-lg">
                  {userInitial || "?"}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Profile
                      </span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Settings
                      </span>
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-600" />
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
