import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Activity,
  Eye,
  Edit,
  Trash2,
  UserCog,
  Badge,
} from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active",
    permissions: {
      manageProducts: false,
      manageOrders: false,
      manageCustomers: false,
      manageTeam: false,
      manageContent: false,
      viewAnalytics: false,
      manageSettings: false,
    },
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Failed to load user: " + error.message);
        setLoading(false);
        return;
      }

      const userInfo = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        status: data.status || "Active",
        permissions: {
          manageProducts: data.permissions?.manageProducts || false,
          manageOrders: data.permissions?.manageOrders || false,
          manageCustomers: data.permissions?.manageCustomers || false,
          manageTeam: data.permissions?.manageTeam || false,
          manageContent: data.permissions?.manageContent || false,
          viewAnalytics: data.permissions?.viewAnalytics || false,
          manageSettings: data.permissions?.manageSettings || false,
        },
      };

      setUserData(userInfo);
      setOriginalData(userInfo);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [name]: checked },
    }));
  };

  const validateForm = () => {
    if (!userData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!userData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!userData.role.trim()) {
      setError("Role is required");
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
      const { name, email, phone, role, status, permissions } = userData;

      const { error } = await supabase
        .from("users")
        .update({
          name,
          email,
          phone,
          role,
          status,
          permissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        setError("Failed to update user: " + error.message);
      } else {
        navigate("/users", {
          state: { message: "User updated successfully" },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) {
        setError("Failed to delete user: " + error.message);
        setSaving(false);
      } else {
        navigate("/users", {
          state: { message: "User deleted successfully" },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(userData) !== JSON.stringify(originalData);
  };

  const permissionConfig = [
    {
      key: "manageProducts",
      label: "Manage Products",
      description: "Add, edit, and delete products",
      icon: Package,
      color: "blue",
    },
    {
      key: "manageOrders",
      label: "Manage Orders",
      description: "View and process customer orders",
      icon: ShoppingCart,
      color: "green",
    },
    {
      key: "manageCustomers",
      label: "Manage Customers",
      description: "View and manage customer accounts",
      icon: Users,
      color: "purple",
    },
    {
      key: "manageTeam",
      label: "Manage Team",
      description: "Manage team members and roles",
      icon: UserCog,
      color: "orange",
    },
    {
      key: "manageContent",
      label: "Manage Content",
      description: "Edit website content and blog posts",
      icon: FileText,
      color: "pink",
    },
    {
      key: "viewAnalytics",
      label: "View Analytics",
      description: "Access reports and analytics",
      icon: Activity,
      color: "indigo",
    },
    {
      key: "manageSettings",
      label: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "gray",
    },
  ];

  const getActivePermissions = () => {
    return Object.entries(userData.permissions).filter(([_, value]) => value)
      .length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/users")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Edit User Account
            </h1>
            <p className="text-gray-600 mt-1">
              Update user information and permissions
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <Badge className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Admin, Manager, Editor"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    userData.status === "Active"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={userData.status === "Active"}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Active</p>
                      <p className="text-sm text-gray-600">
                        User can access the system
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    userData.status === "Inactive"
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={userData.status === "Inactive"}
                    onChange={handleChange}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Inactive</p>
                      <p className="text-sm text-gray-600">
                        User cannot access the system
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Permissions
                </h2>
                <p className="text-sm text-gray-600">
                  {getActivePermissions()} of {permissionConfig.length}{" "}
                  permissions granted
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionConfig.map((perm) => {
                const Icon = perm.icon;
                const isChecked = userData.permissions[perm.key];

                return (
                  <label
                    key={perm.key}
                    className={`relative flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? `border-${perm.color}-200 bg-${perm.color}-50`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={perm.key}
                      checked={isChecked}
                      onChange={handlePermissionChange}
                      className={`mt-1 rounded border-gray-300 text-${perm.color}-600 focus:ring-${perm.color}-500`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${perm.color}-100 rounded-lg`}>
                          <Icon className={`w-4 h-4 text-${perm.color}-600`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {perm.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {perm.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {isChecked && (
                      <CheckCircle
                        className={`w-5 h-5 text-${perm.color}-600`}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* User Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              Account Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {userData.name || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">
                    {userData.email || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {userData.status === "Active" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{userData.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Permissions</p>
                  <p className="font-medium">
                    {getActivePermissions()} granted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete User
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/users")}
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
                    <Clock className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
