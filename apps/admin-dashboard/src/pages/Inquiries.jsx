import React, { useState, useEffect } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Phone,
  Calendar,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  ExternalLink,
  Package,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      // Fetch inquiries with product information if available
      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          *,
          products (
            id,
            name,
            image_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inquiries:", error);
        return;
      }

      setInquiries(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter((inq) => inq.status === "pending").length || 0;
      const responded = data?.filter((inq) => inq.status === "responded").length || 0;
      const resolved = data?.filter((inq) => inq.status === "resolved").length || 0;

      setStats({ total, pending, responded, resolved });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inquiryId);

      if (error) {
        console.error("Error updating inquiry status:", error);
        return;
      }

      // Refresh inquiries after update
      fetchInquiries();
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", inquiryId);

      if (error) {
        console.error("Error deleting inquiry:", error);
        return;
      }

      // Refresh inquiries after deletion
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "responded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "responded":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Inquiries</h1>
          <p className="text-gray-600 mt-2">
            Manage and respond to customer inquiries and product questions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInquiries}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-blue-600">{stats.responded}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inquiries by name, contact, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-600">{inquiry.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {inquiry.products ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={inquiry.products.image_url || "/api/placeholder/40/40"}
                          alt={inquiry.products.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {inquiry.products.name}
                          </p>
                          <p className="text-sm text-gray-600">Product Inquiry</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-gray-600">General Inquiry</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 max-w-xs truncate">
                      {inquiry.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        inquiry.status || "pending"
                      )}`}
                    >
                      {getStatusIcon(inquiry.status || "pending")}
                      {(inquiry.status || "pending").charAt(0).toUpperCase() +
                        (inquiry.status || "pending").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{formatDate(inquiry.created_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <select
                          value={inquiry.status || "pending"}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="responded">Responded</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No inquiries found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No customer inquiries have been submitted yet"}
            </p>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Inquiry Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact</label>
                    <p className="text-gray-900">{selectedInquiry.contact}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              {selectedInquiry.products && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Product Information
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedInquiry.products.image_url || "/api/placeholder/60/60"}
                      alt={selectedInquiry.products.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedInquiry.products.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Product ID: {selectedInquiry.product_id}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedInquiry.status || "pending"
                      )}`}
                    >
                      {getStatusIcon(selectedInquiry.status || "pending")}
                      {(selectedInquiry.status || "pending").charAt(0).toUpperCase() +
                        (selectedInquiry.status || "pending").slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Submitted</label>
                  <p className="text-gray-900">{formatDate(selectedInquiry.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <select
                  value={selectedInquiry.status || "pending"}
                  onChange={(e) => {
                    updateInquiryStatus(selectedInquiry.id, e.target.value);
                    setSelectedInquiry({
                      ...selectedInquiry,
                      status: e.target.value,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="responded">Mark as Responded</option>
                  <option value="resolved">Mark as Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
