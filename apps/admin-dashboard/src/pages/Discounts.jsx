// src/pages/Discounts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Percent,
  DollarSign,
  Grid,
  List,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  ShoppingCart,
} from "lucide-react";

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  async function fetchDiscounts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("discounts")
      .select(
        "id, name, code, discount_type, discount_value, start_date, end_date, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching discounts:", error.message);
    } else {
      setDiscounts(data || []);
    }
    setLoading(false);
  }

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch =
      discount.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || discount.status === statusFilter;
    const matchesType =
      typeFilter === "all" || discount.discount_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: discounts.length,
    active: discounts.filter((d) => d.status === "Active").length,
    percentage: discounts.filter((d) => d.discount_type === "percentage")
      .length,
    fixed: discounts.filter((d) => d.discount_type === "fixed").length,
  };

  const handleSelectDiscount = (discountId) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discountId)
        ? prev.filter((id) => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDiscounts(
      selectedDiscounts.length === filteredDiscounts.length
        ? []
        : filteredDiscounts.map((d) => d.id)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedDiscounts.length === 0) return;

    if (window.confirm(`Delete ${selectedDiscounts.length} discount(s)?`)) {
      const { error } = await supabase
        .from("discounts")
        .delete()
        .in("id", selectedDiscounts);

      if (!error) {
        await fetchDiscounts();
        setSelectedDiscounts([]);
      }
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Discount Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage promotional codes and pricing strategies
            </p>
          </div>
          <Link
            to="/discounts/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Discount
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-gray-600 text-sm">Total Discounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-gray-600 text-sm">Active Discounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.percentage}
                </p>
                <p className="text-gray-600 text-sm">Percentage Based</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.fixed}
                </p>
                <p className="text-gray-600 text-sm">Fixed Amount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            {selectedDiscounts.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedDiscounts.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === "table" ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedDiscounts.length ===
                            filteredDiscounts.length &&
                          filteredDiscounts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Discount
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Code
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Type & Value
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDiscounts.map((discount) => (
                    <tr
                      key={discount.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedDiscounts.includes(discount.id)}
                          onChange={() => handleSelectDiscount(discount.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {discount.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created{" "}
                            {new Date(discount.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {discount.code}
                        </code>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {discount.discount_type === "percentage" ? (
                            <Percent className="w-4 h-4 text-purple-600" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-green-600" />
                          )}
                          <span className="font-medium">
                            {discount.discount_type === "percentage"
                              ? `${discount.discount_value}%`
                              : `₵${discount.discount_value}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>
                            {new Date(discount.start_date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            to{" "}
                            {new Date(discount.end_date).toLocaleDateString()}
                          </p>
                          {isExpired(discount.end_date) && (
                            <span className="text-red-600 text-xs">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            discount.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {discount.status === "Active" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {discount.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/discounts/edit/${discount.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscounts.map((discount) => (
              <div
                key={discount.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(discount.id)}
                      onChange={() => handleSelectDiscount(discount.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div
                      className={`p-2 rounded-lg ${
                        discount.discount_type === "percentage"
                          ? "bg-purple-100"
                          : "bg-green-100"
                      }`}
                    >
                      {discount.discount_type === "percentage" ? (
                        <Percent
                          className={`w-5 h-5 ${
                            discount.discount_type === "percentage"
                              ? "text-purple-600"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <DollarSign className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      discount.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {discount.status === "Active" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {discount.status}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {discount.name}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Code:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {discount.code}
                    </code>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value:</span>
                    <span className="font-medium">
                      {discount.discount_type === "percentage"
                        ? `${discount.discount_value}%`
                        : `₵${discount.discount_value}`}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <p>
                      {new Date(discount.start_date).toLocaleDateString()} -{" "}
                      {new Date(discount.end_date).toLocaleDateString()}
                    </p>
                    {isExpired(discount.end_date) && (
                      <span className="text-red-600 text-xs">Expired</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Created {new Date(discount.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/discounts/edit/${discount.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDiscounts.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20 shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Percent className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No discounts found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first discount code.
            </p>
            <Link
              to="/discounts/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Create First Discount
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
