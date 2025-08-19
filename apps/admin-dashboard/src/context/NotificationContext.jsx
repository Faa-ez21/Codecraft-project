import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscriptions();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Fetch various types of notifications
      const [
        contactMessages,
        productInquiries,
        serviceInquiries,
        lowStockProducts,
        recentOrders,
      ] = await Promise.all([
        fetchContactMessages(),
        fetchProductInquiries(),
        fetchServiceInquiries(),
        fetchLowStockProducts(),
        fetchRecentOrders(),
      ]);

      // Combine all notifications and sort by date
      const allNotifications = [
        ...contactMessages,
        ...productInquiries,
        ...serviceInquiries,
        ...lowStockProducts,
        ...recentOrders,
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .is("status", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((msg) => ({
        id: `contact_${msg.id}`,
        type: "contact_message",
        title: "New Contact Message",
        message: `${msg.name}: ${msg.subject}`,
        time: getTimeAgo(msg.created_at),
        created_at: msg.created_at,
        read: msg.status !== null,
        data: msg,
        actionUrl: `/contact-messages?messageId=${msg.id}`,
      }));
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return [];
    }
  };

  const fetchProductInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((inquiry) => ({
        id: `inquiry_${inquiry.id}`,
        type: "product_inquiry",
        title: "New Product Inquiry",
        message: `Inquiry from ${inquiry.name}`,
        time: getTimeAgo(inquiry.created_at),
        created_at: inquiry.created_at,
        read: false,
        data: inquiry,
        actionUrl: `/inquiries?inquiryId=${inquiry.id}`,
      }));
    } catch (error) {
      console.error("Error fetching product inquiries:", error);
      return [];
    }
  };

  const fetchServiceInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("service_inquiries")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((inquiry) => ({
        id: `service_${inquiry.id}`,
        type: "service_inquiry",
        title: "New Service Inquiry",
        message: `${inquiry.service_type} inquiry from ${inquiry.name}`,
        time: getTimeAgo(inquiry.created_at),
        created_at: inquiry.created_at,
        read: false,
        data: inquiry,
        actionUrl: `/service-inquiries?inquiryId=${inquiry.id}`,
      }));
    } catch (error) {
      console.error("Error fetching service inquiries:", error);
      return [];
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lt("stock_quantity", 10)
        .eq("status", "active")
        .order("stock_quantity", { ascending: true })
        .limit(5);

      if (error) throw error;

      return (data || []).map((product) => ({
        id: `stock_${product.id}`,
        type: "low_stock",
        title: "Low Stock Alert",
        message: `${product.name} - only ${product.stock_quantity || 0} left`,
        time: "Stock alert",
        created_at: new Date().toISOString(),
        read: false,
        data: product,
        actionUrl: `/products?productId=${product.id}`,
      }));
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      return [];
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((order) => ({
        id: `order_${order.id}`,
        type: "new_order",
        title: "New Order Received",
        message: `Order #${order.id} - $${order.total?.toFixed(2) || "0.00"}`,
        time: getTimeAgo(order.created_at),
        created_at: order.created_at,
        read: false,
        data: order,
        actionUrl: `/orders/${order.id}`,
      }));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      return [];
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to contact messages
    const contactChannel = supabase
      .channel("contact_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contact",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Subscribe to inquiries
    const inquiryChannel = supabase
      .channel("inquiry_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "inquiries",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Subscribe to orders
    const orderChannel = supabase
      .channel("order_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contactChannel);
      supabase.removeChannel(inquiryChannel);
      supabase.removeChannel(orderChannel);
    };
  };

  const markAsRead = async (notificationId) => {
    try {
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      // If it's a contact message, update the database
      if (notificationId.startsWith("contact_")) {
        const messageId = notificationId.replace("contact_", "");
        await supabase
          .from("contact")
          .update({ status: "read" })
          .eq("id", messageId);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      // Update contact messages in database
      const contactIds = notifications
        .filter((n) => n.type === "contact_message" && !n.read)
        .map((n) => n.data.id);

      if (contactIds.length > 0) {
        await supabase
          .from("contact")
          .update({ status: "read" })
          .in("id", contactIds);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} day ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "contact_message":
        return "mail";
      case "product_inquiry":
        return "package";
      case "service_inquiry":
        return "tool";
      case "low_stock":
        return "alert-triangle";
      case "new_order":
        return "shopping-bag";
      default:
        return "bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "contact_message":
        return "bg-blue-500";
      case "product_inquiry":
        return "bg-green-500";
      case "service_inquiry":
        return "bg-purple-500";
      case "low_stock":
        return "bg-red-500";
      case "new_order":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    getNotificationIcon,
    getNotificationColor,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
