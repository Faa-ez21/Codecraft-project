import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Percent,
  DollarSign,
  Calendar,
  Package,
  Tag,
  Sparkles,
  Target,
  Clock,
  AlertCircle,
  CheckCircle2,
  Gift,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function CreateDiscount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    discount_type: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    product_ids: [],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [codeError, setCodeError] = useState("");

  const generateUUID = () => crypto.randomUUID();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price");
    if (error) {
      console.error("Failed to fetch products:", error);
    } else {
      setProducts(data || []);
    }
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    setForm((prev) => ({ ...prev, code }));
  };

  const validateCode = async (code) => {
    if (!code) return;

    const { data } = await supabase
      .from("discounts")
      .select("id")
      .eq("code", code)
      .limit(1);

    if (data && data.length > 0) {
      setCodeError("This code already exists");
    } else {
      setCodeError("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "code") {
      validateCode(value);
    }
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setForm((prev) => ({ ...prev, product_ids: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (codeError) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const {
      name,
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_ids,
    } = form;

    const discountId = generateUUID();

    // Insert into discounts
    const { error: discountError } = await supabase.from("discounts").insert([
      {
        id: discountId,
        name,
        code,
        discount_type,
        discount_value: parseFloat(discount_value),
        start_date,
        end_date,
        status: "Active",
        created_at: new Date().toISOString(),
      },
    ]);

    if (discountError) {
      setError(discountError.message);
      setLoading(false);
      return;
    }

    // Insert into discount_products if selected
    if (product_ids.length > 0) {
      const mappings = product_ids.map((pid) => ({
        id: generateUUID(),
        discount_id: discountId,
        product_id: pid,
      }));

      const { error: mappingError } = await supabase
        .from("discount_products")
        .insert(mappings);

      if (mappingError) {
        setError(mappingError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setTimeout(() => {
      navigate("/discounts");
    }, 1500);
    setLoading(false);
  };

  const selectedProductsData = products.filter((p) =>
    form.product_ids.includes(p.id)
  );
  const totalProducts = products.length;
  const selectedCount = form.product_ids.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/discounts")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Create Discount
              </h1>
              <p className="text-gray-600 mt-1">
                Set up promotional offers and discount codes
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Discount created successfully! Redirecting...
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Discount Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Summer Sale 2024"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Discount Code *
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required
                        placeholder="e.g., SUMMER20"
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          codeError
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                        title="Generate Random Code"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                    {codeError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {codeError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Discount Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Discount Type *
                    </label>
                    <select
                      name="discount_type"
                      value={form.discount_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    >
                      <option value="">Select Type</option>
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        placeholder={
                          form.discount_type === "Percentage" ? "20" : "50.00"
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {form.discount_type === "Percentage" ? (
                          <Percent className="w-4 h-4 text-gray-400" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Valid Period
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Start Date *
                    </label>
                    <input
                      name="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      End Date *
                    </label>
                    <input
                      name="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Apply to Products
                  </h2>
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Products ({selectedCount} of {totalProducts}{" "}
                    selected)
                  </label>
                  <select
                    multiple
                    name="product_ids"
                    value={form.product_ids}
                    onChange={handleProductSelect}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 h-48"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="py-2">
                        {p.name} - ${p.price}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                    products. Leave empty to apply to all products.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submit Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  codeError ||
                  !form.name ||
                  !form.code ||
                  !form.discount_type ||
                  !form.discount_value ||
                  !form.start_date ||
                  !form.end_date
                }
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold 
                         hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Create Discount
                  </>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Preview
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-800">
                    {form.name || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {form.code || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-800">
                    {form.discount_type || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium text-gray-800">
                    {form.discount_value
                      ? `${
                          form.discount_type === "Percentage"
                            ? form.discount_value + "%"
                            : "$" + form.discount_value
                        }`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium text-gray-800">
                    {form.start_date && form.end_date
                      ? `${form.start_date} to ${form.end_date}`
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium text-gray-800">
                    {form.product_ids.length === 0
                      ? "All products"
                      : `${form.product_ids.length} selected`}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Products */}
            {selectedProductsData.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Selected Products
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedProductsData.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {product.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${product.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use clear, memorable discount codes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set reasonable expiry dates</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Test discounts before publishing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
