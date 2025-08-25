import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Eye,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Mail,
  Package,
  Wrench,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
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

  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getIconComponent = (iconName, className = "w-5 h-5") => {
    switch (iconName) {
      case "mail":
        return <Mail className={className} />;
      case "package":
        return <Package className={className} />;
      case "tool":
        return <Wrench className={className} />;
      case "alert-triangle":
        return <AlertTriangle className={className} />;
      case "shopping-bag":
        return <ShoppingBag className={className} />;
      default:
        return <Bell className={className} />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read);

    const matchesTypeFilter =
      typeFilter === "all" || notification.type === typeFilter;

    const matchesSearch =
      !searchTerm ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesReadFilter && matchesTypeFilter && matchesSearch;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to the action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const deleteNotification = (notificationId, e) => {
    e.stopPropagation();
    // In a real app, you'd have a delete function in the context
    console.log("Delete notification:", notificationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8 text-green-600" />
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with your dashboard activities
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshNotifications}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-800">
                  {notifications.length}
                </p>
              </div>
              <Bell className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <div className="relative">
                <Bell className="w-10 h-10 text-red-500" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-3xl font-bold text-green-600">
                  {notifications.length - unreadCount}
                </p>
              </div>
              <CheckCheck className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="contact_message">Contact Messages</option>
                <option value="product_inquiry">Product Inquiries</option>
                <option value="service_inquiry">Service Inquiries</option>
                <option value="low_stock">Low Stock</option>
                <option value="new_order">New Orders</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read
                      ? "bg-blue-50/50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getIconComponent(getNotificationIcon(notification.type))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`font-semibold ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {notification.time}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            notification.type === "contact_message"
                              ? "bg-blue-100 text-blue-800"
                              : notification.type === "product_inquiry"
                              ? "bg-green-100 text-green-800"
                              : notification.type === "service_inquiry"
                              ? "bg-purple-100 text-purple-800"
                              : notification.type === "low_stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {notification.type
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) =>
                              deleteNotification(notification.id, e)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You're all caught up! No notifications at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
