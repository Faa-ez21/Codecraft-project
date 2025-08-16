import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Edit3,
  MoreVertical,
  Star,
  Clock,
  Package,
  CreditCard,
  MessageCircle,
  Settings,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
    fetchCustomerOrders();
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching customer:", error.message);
    } else {
      setCustomer(data);
    }
    setLoading(false);
  };

  const fetchCustomerOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data || []);
    }
    setOrdersLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-white/20">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Customer Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The customer you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/customers")}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    avgOrderValue:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + (order.total || 0), 0) /
          orders.length
        : 0,
    lastOrderDate:
      orders.length > 0
        ? new Date(orders[0].created_at).toLocaleDateString()
        : "Never",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customers")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Customer Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete customer profile and order history
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Edit3 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {customer.name
                      ? customer.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {customer.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Customer ID: {customer.id}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {customer.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">
                      {customer.location || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium text-gray-800">
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
                  <MessageCircle className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-medium text-blue-600">
                    Message
                  </span>
                </button>
                <button className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
                  <CreditCard className="w-5 h-5 text-green-600 mb-1" />
                  <span className="text-xs font-medium text-green-600">
                    Refund
                  </span>
                </button>
                <button className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
                  <Settings className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="text-xs font-medium text-purple-600">
                    Settings
                  </span>
                </button>
                <button className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200">
                  <Package className="w-5 h-5 text-orange-600 mb-1" />
                  <span className="text-xs font-medium text-orange-600">
                    Order
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Stats & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Orders",
                  value: stats.totalOrders,
                  icon: ShoppingBag,
                  color: "from-blue-500 to-cyan-500",
                  change: "+2 this month",
                },
                {
                  title: "Total Spent",
                  value: `$${stats.totalSpent.toFixed(2)}`,
                  icon: DollarSign,
                  color: "from-green-500 to-emerald-500",
                  change: "+$150 this month",
                },
                {
                  title: "Avg Order",
                  value: `$${stats.avgOrderValue.toFixed(2)}`,
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500",
                  change: "+5% vs last month",
                },
                {
                  title: "Last Order",
                  value: stats.lastOrderDate,
                  icon: Clock,
                  color: "from-yellow-500 to-orange-500",
                  change: "Recent activity",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-green-500 text-xs font-semibold mt-1">
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    Order History
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All Orders
                  </button>
                </div>
              </div>

              {ordersLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {orders.map((order, index) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-green-50/50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Order #{order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}{" "}
                              • {order.items?.length || 0} items
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ${order.total?.toFixed(2) || "0.00"}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm">
                    This customer hasn't placed any orders
                  </p>
                </div>
              )}
            </div>

            {/* Customer Notes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Customer Notes
              </h3>
              <textarea
                placeholder="Add notes about this customer..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
              />
              <div className="flex justify-end mt-3">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
