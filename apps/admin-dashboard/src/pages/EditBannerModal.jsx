import { useState } from "react";
import {
  X,
  Image,
  Calendar,
  Link as LinkIcon,
  Eye,
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function EditBannerModal({ banner, onClose, onSave }) {
  const [title, setTitle] = useState(banner.title);
  const [displayPeriod, setDisplayPeriod] = useState(banner.displayPeriod);
  const [linkTo, setLinkTo] = useState(banner.linkTo);
  const [status, setStatus] = useState(banner.status);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!displayPeriod.trim()) {
      newErrors.displayPeriod = "Display period is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      onSave({
        ...banner,
        title,
        displayPeriod,
        linkTo,
        status,
        lastModified: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      title !== banner.title ||
      displayPeriod !== banner.displayPeriod ||
      linkTo !== banner.linkTo ||
      status !== banner.status
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Edit Banner</h2>
                <p className="text-blue-100 text-sm">
                  Customize banner content and settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Settings className="w-4 h-4" />
              Banner Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              placeholder="Enter compelling banner title"
            />
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Display Period */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Display Period *
            </label>
            <input
              type="text"
              value={displayPeriod}
              onChange={(e) => setDisplayPeriod(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.displayPeriod
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
              placeholder="e.g., July 1 - July 31, 2024"
            />
            {errors.displayPeriod && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.displayPeriod}
              </div>
            )}
          </div>

          {/* Link Target */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4" />
              Link Target
            </label>
            <input
              type="text"
              value={linkTo}
              onChange={(e) => setLinkTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Product category, specific product, or URL"
            />
            <p className="text-sm text-gray-500 mt-2">
              Where should users go when they click this banner? (Optional)
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Eye className="w-4 h-4" />
              Visibility Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  status === "Active"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === "Active"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Active</p>
                    <p className="text-sm text-gray-600">Banner is visible</p>
                  </div>
                </div>
              </label>

              <label
                className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  status === "Inactive"
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === "Inactive"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Inactive</p>
                    <p className="text-sm text-gray-600">Banner is hidden</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
              <h3 className="font-semibold text-lg">
                {title || "Banner Title"}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {displayPeriod || "Display period"}
              </p>
              {linkTo && (
                <p className="text-blue-200 text-xs mt-2">Links to: {linkTo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {hasChanges() ? (
                <span className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  Unsaved changes
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  No changes
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
