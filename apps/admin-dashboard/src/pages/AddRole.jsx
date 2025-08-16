import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft,
  Save,
  Shield,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Package,
  ShoppingCart,
  FileText,
  Layers,
  UserCheck,
} from "lucide-react";

const AddRole = () => {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("Active");
  const [permissions, setPermissions] = useState({
    "Manage Products": false,
    "Manage Orders": false,
    "Manage Users": false,
    "Manage Content Management": false,
    "Manage Categories": false,
    "Manage Customers": false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const permissionIcons = {
    "Manage Products": Package,
    "Manage Orders": ShoppingCart,
    "Manage Users": Users,
    "Manage Content Management": FileText,
    "Manage Categories": Layers,
    "Manage Customers": UserCheck,
  };

  const permissionDescriptions = {
    "Manage Products": "Create, edit, and delete products in the inventory",
    "Manage Orders": "View and manage customer orders and fulfillment",
    "Manage Users": "Add, edit, and manage user accounts and permissions",
    "Manage Content Management": "Edit website content, blogs, and pages",
    "Manage Categories":
      "Create and manage product categories and subcategories",
    "Manage Customers": "View and manage customer information and support",
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    setLoading(true);
    setError("");

    const selectedPermissions = Object.entries(permissions)
      .filter(([, value]) => value)
      .map(([key]) => key);

    try {
      const { error } = await supabase.from("roles").insert([
        {
          id: uuidv4(),
          name: roleName,
          status,
          permissions: selectedPermissions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Success feedback and navigation
      setTimeout(() => {
        navigate("/admin-roles");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPermissionsCount =
    Object.values(permissions).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin-roles")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Create New Role
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Define permissions and access levels for team members
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Role Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Content Manager, Sales Associate"
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Permissions
                </h2>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPermissionsCount} of {Object.keys(permissions).length}{" "}
                selected
              </div>
            </div>

            <div className="space-y-4">
              {Object.keys(permissions).map((key) => {
                const IconComponent = permissionIcons[key] || Settings;
                return (
                  <label
                    key={key}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={permissions[key]}
                      onChange={handlePermissionChange}
                      className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            permissions[key]
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-gray-100 dark:bg-gray-700"
                          } transition-colors`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${
                              permissions[key]
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            permissions[key]
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {key}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-10">
                        {permissionDescriptions[key]}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Role Summary */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Role Name:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {roleName || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Permissions:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedPermissionsCount} assigned
                </span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h4 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Error
                </h4>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || !roleName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? "Creating Role..." : "Create Role"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin-roles")}
                className="w-full px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRole;
