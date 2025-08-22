// src/pages/EditDiscount.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  ArrowLeft,
  Percent,
  DollarSign,
  Calendar,
  Package,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Settings,
  Tag,
  ShoppingCart,
  Users,
  TrendingUp,
  Copy,
  Loader,
} from "lucide-react";

export default function EditDiscount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    discount_type: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    product_ids: [],
    usage_limit: "",
    minimum_order: "",
    description: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [originalData, setOriginalData] = useState(null);

  // Load discount and product list
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [{ data: discount, error: discountError }, { data: productList }] =
        await Promise.all([
          supabase.from("discounts").select("*").eq("id", id).single(),
          supabase.from("products").select("id, name, price"),
        ]);

      if (discountError) {
        setError("Failed to load discount: " + discountError.message);
        setLoading(false);
        return;
      }

      const { data: mappings } = await supabase
        .from("discount_products")
        .select("product_id")
        .eq("discount_id", id);

      const selectedProductIds = mappings?.map((m) => m.product_id) || [];

      const formData = {
        name: discount.name || "",
        code: discount.code || "",
        discount_type: discount.discount_type || "",
        discount_value: discount.discount_value || "",
        start_date: discount.start_date?.split("T")[0] || "",
        end_date: discount.end_date?.split("T")[0] || "",
        product_ids: selectedProductIds,
        usage_limit: discount.usage_limit || "",
        minimum_order: discount.minimum_order || "",
        description: discount.description || "",
      };

      setForm(formData);
      setOriginalData(formData);
      setProducts(productList || []);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (productId) => {
    setForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter((id) => id !== productId)
        : [...prev.product_ids, productId],
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Discount name is required");
      return false;
    }
    if (!form.code.trim()) {
      setError("Discount code is required");
      return false;
    }
    if (!form.discount_type) {
      setError("Please select a discount type");
      return false;
    }
    if (!form.discount_value || parseFloat(form.discount_value) <= 0) {
      setError("Please enter a valid discount value");
      return false;
    }
    if (!form.start_date || !form.end_date) {
      setError("Please specify the discount period");
      return false;
    }
    if (new Date(form.start_date) >= new Date(form.end_date)) {
      setError("End date must be after start date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      const {
        name,
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        product_ids,
        usage_limit,
        minimum_order,
        description,
      } = form;

      const { error: updateError } = await supabase
        .from("discounts")
        .update({
          name,
          code,
          discount_type: discount_type.toLowerCase(),
          discount_value: parseFloat(discount_value),
          start_date,
          end_date,
          usage_limit: usage_limit ? parseInt(usage_limit) : null,
          minimum_order: minimum_order ? parseFloat(minimum_order) : null,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Clear and re-insert product mappings
      await supabase.from("discount_products").delete().eq("discount_id", id);

      if (product_ids.length > 0) {
        const mappings = product_ids.map((pid) => ({
          discount_id: id,
          product_id: pid,
        }));
        await supabase.from("discount_products").insert(mappings);
      }

      navigate("/discounts", {
        state: { message: "Discount updated successfully" },
      });
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this discount? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase.from("discounts").delete().eq("id", id);

      if (error) {
        setError("Failed to delete discount: " + error.message);
        setSaving(false);
      } else {
        navigate("/discounts", {
          state: { message: "Discount deleted successfully" },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setSaving(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(form.code);
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(form) !== JSON.stringify(originalData);
  };

  const getDiscountPreview = () => {
    if (!form.discount_value) return "No discount";
    return form.discount_type === "percentage"
      ? `${form.discount_value}% off`
      : `₵${form.discount_value} off`;
  };

  const getSelectedProductsValue = () => {
    return form.product_ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)
      .reduce((total, product) => total + (parseFloat(product.price) || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Error Loading Discount
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/discounts")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Discounts
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
            onClick={() => navigate("/discounts")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Edit Discount
            </h1>
            <p className="text-gray-600 mt-1">
              Modify discount details and settings
            </p>
          </div>

          {/* Quick Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Preview</p>
              <p className="text-lg font-bold text-blue-600">
                {getDiscountPreview()}
              </p>
              <p className="text-xs text-gray-500">{form.code}</p>
            </div>
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
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("basic")}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "basic"
                        ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Basic Info
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "products"
                        ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products ({form.product_ids.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("advanced")}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "advanced"
                        ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Advanced
                    </div>
                  </button>
                </nav>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    {/* Name & Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Summer Sale 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Code *
                        </label>
                        <div className="relative">
                          <input
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            placeholder="SUMMER20"
                          />
                          <button
                            type="button"
                            onClick={copyCode}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Type & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              form.discount_type === "percentage"
                                ? "border-purple-200 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="discount_type"
                              value="percentage"
                              checked={form.discount_type === "percentage"}
                              onChange={handleChange}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <div className="flex items-center gap-2">
                              <Percent className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Percentage</span>
                            </div>
                          </label>

                          <label
                            className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              form.discount_type === "fixed"
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="discount_type"
                              value="fixed"
                              checked={form.discount_type === "fixed"}
                              onChange={handleChange}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 text-green-600">₵</span>
                              <span className="font-medium">Fixed</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Value *
                        </label>
                        <div className="relative">
                          <input
                            name="discount_value"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.discount_value}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={
                              form.discount_type === "percentage"
                                ? "20"
                                : "50.00"
                            }
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {form.discount_type === "percentage" ? "%" : "₵"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <div className="relative">
                          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="start_date"
                            type="date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <div className="relative">
                          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="end_date"
                            type="date"
                            value={form.end_date}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Brief description of the discount..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === "products" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Select Products
                      </h3>
                      <span className="text-sm text-gray-600">
                        {form.product_ids.length} of {products.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {products.map((product) => (
                        <label
                          key={product.id}
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            form.product_ids.includes(product.id)
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.product_ids.includes(product.id)}
                            onChange={() => handleProductSelect(product.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₵{product.price}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {form.product_ids.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>
                          No products selected. Discount will apply to all
                          products.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "advanced" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usage Limit
                        </label>
                        <input
                          name="usage_limit"
                          type="number"
                          min="1"
                          value={form.usage_limit}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Unlimited"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Maximum number of times this discount can be used
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Order Value
                        </label>
                        <div className="relative">
                          <input
                            name="minimum_order"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.minimum_order}
                            onChange={handleChange}
                            className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₵
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum cart value required to use this discount
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Discount
                  </button>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/discounts")}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !hasChanges()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update Discount
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Discount Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Discount Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {form.discount_type || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium">{getDiscountPreview()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-sm">
                    {form.start_date && form.end_date
                      ? `${new Date(
                          form.start_date
                        ).toLocaleDateString()} - ${new Date(
                          form.end_date
                        ).toLocaleDateString()}`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">
                    {form.product_ids.length === 0
                      ? "All"
                      : form.product_ids.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Changes Indicator */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                {hasChanges() ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">
                        Unsaved Changes
                      </p>
                      <p className="text-sm text-orange-700">
                        Remember to save your changes
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">All Saved</p>
                      <p className="text-sm text-green-700">
                        No pending changes
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected Products Value */}
            {form.product_ids.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Selected Products
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Count:</span>
                    <span className="font-medium">
                      {form.product_ids.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">
                      ₵{getSelectedProductsValue().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
