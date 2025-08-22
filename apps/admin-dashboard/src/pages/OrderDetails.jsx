import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ArrowLeft,
  User,
  Calendar,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy,
  Printer,
  Download,
  Eye,
  Edit,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              image_url,
              price
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (orderError) {
        setError("Failed to load order: " + orderError.message);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Fetch customer details if user_id exists
      if (orderData.user_id) {
        const { data: customerData } = await supabase
          .from("users")
          .select("*")
          .eq("id", orderData.user_id)
          .single();

        setCustomer(customerData);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (field, value) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          [field]: value,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        setError("Failed to update order: " + error.message);
      } else {
        await fetchOrderDetails();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: RefreshCw,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertTriangle,
      paid: CheckCircle,
      unpaid: AlertTriangle,
    };
    const Icon = icons[status?.toLowerCase()] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  // Calculate totals
  const subtotal =
    order?.order_items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;
  const shipping = order?.shipping_cost || 200;
  const tax = order?.tax_amount || 0;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Order #{order.id?.slice(0, 8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyOrderId}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
              title="Copy Order ID"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {order.order_items?.length > 0 ? (
                  order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={
                          item.products?.image_url ||
                          "https://via.placeholder.com/60?text=Product"
                        }
                        alt={item.products?.name}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.products?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Unit Price: ₵{item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No items found in this order</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Information
                </h2>
              </div>

              {customer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Contact Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {customer.name || "No name provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {customer.email || "No email provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {customer.phone || "No phone provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Account Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          Member since{" "}
                          {new Date(customer.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          User ID: {customer.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Guest checkout - No customer account</p>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Delivery Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {order.shipping_method || "Standard Shipping"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        Tracking:{" "}
                        {order.tracking_number ||
                          "GH" + order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {order.shipping_address ||
                          "123 Accra Street, Accra, Ghana"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Estimated Delivery
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {order.estimated_delivery
                          ? new Date(
                              order.estimated_delivery
                            ).toLocaleDateString()
                          : "3-5 business days"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        Standard delivery hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fulfillment Status
                  </label>
                  <select
                    value={order.fulfillment_status || "pending"}
                    onChange={(e) =>
                      updateOrderStatus("fulfillment_status", e.target.value)
                    }
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={order.payment_status || "pending"}
                    onChange={(e) =>
                      updateOrderStatus("payment_status", e.target.value)
                    }
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Current Status:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.fulfillment_status
                      )}`}
                    >
                      {getStatusIcon(order.fulfillment_status)}
                      {order.fulfillment_status || "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {getStatusIcon(order.payment_status)}
                      {order.payment_status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>₵{shipping.toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>₵{tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total:</span>
                    <span>₵{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Payment Details</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">
                    {order.payment_method || "Mobile Money"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-sm">
                    {order.transaction_id ||
                      order.id.slice(0, 12).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  View Invoice
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Order
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refund Order
                </button>
                {customer && (
                  <button
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
