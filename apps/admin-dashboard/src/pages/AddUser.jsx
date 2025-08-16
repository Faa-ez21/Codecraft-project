import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield,
  Settings,
  CheckCircle,
  AlertCircle,
  Package,
  ShoppingCart,
  FileText,
  Layers,
  UserCheck,
  Users,
} from "lucide-react";

const AddUser = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const permissionIcons = {
    "Manage Products": Package,
    "Manage Orders": ShoppingCart,
    "Manage Users": Users,
    "Manage Content Management": FileText,
    "Manage Categories": Layers,
    "Manage Customers": UserCheck,
    "Manage Team": Users,
  };

  const permissionDescriptions = {
    "Manage Products": "Create, edit, and delete products in the inventory",
    "Manage Orders": "View and manage customer orders and fulfillment",
    "Manage Users": "Add, edit, and manage user accounts and permissions",
    "Manage Content Management": "Edit website content, blogs, and pages",
    "Manage Categories":
      "Create and manage product categories and subcategories",
    "Manage Customers": "View and manage customer information and support",
    "Manage Team": "Manage team members and their assignments",
  };

  // Fetch active roles from Supabase
  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("name, permissions")
        .eq("status", "Active");

      if (error) {
        console.error("Error fetching roles:", error.message);
        setError("Failed to load roles");
      } else {
        setRoles(data || []);
      }
    };

    fetchRoles();
  }, []);

  // Handle name and email change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  // When role is selected, auto-fill permissions
  const handleRoleSelect = (e) => {
    const selectedRoleName = e.target.value;
    const selectedRole = roles.find((r) => r.name === selectedRoleName);

    setFormData((prev) => ({
      ...prev,
      role: selectedRoleName,
      permissions: selectedRole?.permissions || [],
    }));
  };

  // Toggle individual permission checkbox
  const handleCheckboxChange = (permission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      const updatedPermissions = exists
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];

      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Submit new user to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const { name, email, role, permissions } = formData;

    try {
      const { error } = await supabase.from("users").insert([
        {
          name,
          email,
          role,
          permissions,
          status: "Active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // All permissions for display
  const allPermissions = [
    "Manage Products",
    "Manage Orders",
    "Manage Customers",
    "Manage Team",
    "Manage Users",
    "Manage Content Management",
    "Manage Categories",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/users")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Add Team Member
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new user account with specific roles and permissions
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleSelect}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.name} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                {formData.permissions.length} of {allPermissions.length}{" "}
                selected
              </div>
            </div>

            <div className="space-y-4">
              {allPermissions.map((permission) => {
                const IconComponent = permissionIcons[permission] || Settings;
                const isChecked = formData.permissions.includes(permission);

                return (
                  <label
                    key={permission}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(permission)}
                      className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            isChecked
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-gray-100 dark:bg-gray-700"
                          } transition-colors`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${
                              isChecked ? "text-green-600" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            isChecked
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {permission}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-10">
                        {permissionDescriptions[permission] ||
                          "Standard permission for this role"}
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
          {/* User Summary */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Name:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.name || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Email:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.email || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Role:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.role || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Permissions:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.permissions.length} assigned
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="text-sm font-medium text-green-800 dark:text-green-400">
                  Success!
                </h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                User created successfully. Redirecting...
              </p>
            </div>
          )}

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
                disabled={
                  loading ||
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  !formData.role
                }
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? "Creating User..." : "Create User"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/users")}
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

export default AddUser;
