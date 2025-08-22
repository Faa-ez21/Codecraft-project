import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Plus,
  Image as ImageIcon,
  Calendar,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  Loader,
} from "lucide-react";

export default function HomepageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    display_start: "",
    display_end: "",
    link_url: "",
    image_url: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("homepage_banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load banners: " + error.message);
      } else {
        setBanners(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Banner title is required");
      return false;
    }
    if (!formData.display_start) {
      setError("Display start date is required");
      return false;
    }
    if (!formData.display_end) {
      setError("Display end date is required");
      return false;
    }
    if (new Date(formData.display_start) >= new Date(formData.display_end)) {
      setError("End date must be after start date");
      return false;
    }
    if (!formData.image_url.trim()) {
      setError("Image URL is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      if (editingBanner) {
        const { error } = await supabase
          .from("homepage_banners")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingBanner.id);

        if (error) {
          setError("Failed to update banner: " + error.message);
        } else {
          await fetchBanners();
          resetForm();
        }
      } else {
        const { error } = await supabase.from("homepage_banners").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          setError("Failed to create banner: " + error.message);
        } else {
          await fetchBanners();
          resetForm();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      display_start:
        banner.display_start?.split("T")[0] +
          "T" +
          banner.display_start?.split("T")[1]?.substring(0, 5) || "",
      display_end:
        banner.display_end?.split("T")[0] +
          "T" +
          banner.display_end?.split("T")[1]?.substring(0, 5) || "",
      link_url: banner.link_url || "",
      image_url: banner.image_url || "",
      description: banner.description || "",
      status: banner.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase
        .from("homepage_banners")
        .delete()
        .eq("id", bannerId);

      if (error) {
        setError("Failed to delete banner: " + error.message);
      } else {
        await fetchBanners();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (banner) => {
    setSaving(true);
    setError("");

    try {
      const { error } = await supabase
        .from("homepage_banners")
        .update({
          status: !banner.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", banner.id);

      if (error) {
        setError("Failed to update banner status: " + error.message);
      } else {
        await fetchBanners();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      display_start: "",
      display_end: "",
      link_url: "",
      image_url: "",
      description: "",
      status: true,
    });
    setEditingBanner(null);
    setShowForm(false);
    setError("");
  };

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && banner.status) ||
      (statusFilter === "inactive" && !banner.status);
    return matchesSearch && matchesStatus;
  });

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  const stats = {
    total: banners.length,
    active: banners.filter((b) => b.status).length,
    expired: banners.filter((b) => isExpired(b.display_end)).length,
    live: banners.filter(
      (b) => b.status && isActive(b.display_start, b.display_end)
    ).length,
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
              Homepage Banners
            </h1>
            <p className="text-gray-600 mt-1">
              Manage promotional banners displayed on your homepage
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-gray-600 text-sm">Total Banners</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.live}</p>
                <p className="text-gray-600 text-sm">Currently Live</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-gray-600 text-sm">Active Status</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.expired}
                </p>
                <p className="text-gray-600 text-sm">Expired</p>
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
                placeholder="Search banners..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {filteredBanners.length} banner(s) found
            </span>
          </div>
        </div>

        {/* Banners Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        banner.status
                          ? isActive(banner.display_start, banner.display_end)
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {banner.status
                        ? isActive(banner.display_start, banner.display_end)
                          ? "Live"
                          : isExpired(banner.display_end)
                          ? "Expired"
                          : "Scheduled"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {banner.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(banner.display_start).toLocaleDateString()} -{" "}
                        {new Date(banner.display_end).toLocaleDateString()}
                      </span>
                    </div>
                    {banner.link_url && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">{banner.link_url}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => toggleStatus(banner)}
                      disabled={saving}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        banner.status
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {banner.status ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      {banner.status ? "Active" : "Inactive"}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        disabled={saving}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Banner
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Period
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Link
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
                  {filteredBanners.map((banner) => (
                    <tr
                      key={banner.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/48?text=?";
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {banner.title}
                            </p>
                            {banner.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {banner.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div>
                          <p>
                            {new Date(
                              banner.display_start
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            to{" "}
                            {new Date(banner.display_end).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {banner.link_url ? (
                          <a
                            href={banner.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No link</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            banner.status
                              ? isActive(
                                  banner.display_start,
                                  banner.display_end
                                )
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {banner.status ? (
                            isActive(
                              banner.display_start,
                              banner.display_end
                            ) ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Live
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />{" "}
                                {isExpired(banner.display_end)
                                  ? "Expired"
                                  : "Scheduled"}
                              </>
                            )
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleStatus(banner)}
                            disabled={saving}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title={banner.status ? "Deactivate" : "Activate"}
                          >
                            {banner.status ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(banner)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            disabled={saving}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
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
          </div>
        )}

        {filteredBanners.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20 shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No banners found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first homepage banner.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Create First Banner
            </button>
          </div>
        )}

        {/* Banner Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {editingBanner ? "Edit Banner" : "Create New Banner"}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {editingBanner
                          ? "Update banner details"
                          : "Add a new promotional banner"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g., Summer Sale 2024"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the banner..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Start *
                    </label>
                    <input
                      name="display_start"
                      value={formData.display_start}
                      onChange={handleInputChange}
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display End *
                    </label>
                    <input
                      name="display_end"
                      value={formData.display_end}
                      onChange={handleInputChange}
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL
                  </label>
                  <input
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://example.com/promotion"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://example.com/banner-image.jpg"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {formData.image_url && (
                    <div className="mt-3">
                      <img
                        src={formData.image_url}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active (banner will be visible when in display period)
                  </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        {editingBanner ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingBanner ? "Update Banner" : "Create Banner"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
