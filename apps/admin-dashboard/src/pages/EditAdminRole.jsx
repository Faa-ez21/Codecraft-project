import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Shield,
  User,
  Settings,
  Save,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react";

const EditAdminRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("Active");
  const [permissions, setPermissions] = useState({
    products: false,
    orders: false,
    customers: false,
    team: false,
    analytics: false,
    content: false,
    settings: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [originalData, setOriginalData] = useState(null);

  // Fetch role data by ID
  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setError("Failed to load role data");
        setLoading(false);
        return;
      }

      const roleData = {
        name: data.name,
        status: data.status,
        permissions: {
          products: data.permissions?.includes("products") || false,
          orders: data.permissions?.includes("orders") || false,
          customers: data.permissions?.includes("customers") || false,
          team: data.permissions?.includes("team") || false,
          analytics: data.permissions?.includes("analytics") || false,
          content: data.permissions?.includes("content") || false,
          settings: data.permissions?.includes("settings") || false,
        },
      };

      setRoleName(roleData.name);
      setStatus(roleData.status);
      setPermissions(roleData.permissions);
      setOriginalData(roleData);
      setLoading(false);
    };

    if (id) fetchRole();
  }, [id]);

  const handleCheckbox = (perm) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedPermissions = Object.keys(permissions).filter(
        (key) => permissions[key]
      );

      const { error } = await supabase
        .from("roles")
        .update({
          name: roleName,
          status,
          permissions: updatedPermissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        setError("Failed to update role: " + error.message);
      } else {
        navigate("/admin-roles", {
          state: { message: "Role updated successfully" },
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
        "Are you sure you want to delete this role? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase.from("roles").delete().eq("id", id);

      if (error) {
        setError("Failed to delete role: " + error.message);
        setSaving(false);
      } else {
        navigate("/admin-roles", {
          state: { message: "Role deleted successfully" },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      roleName !== originalData.name ||
      status !== originalData.status ||
      JSON.stringify(permissions) !== JSON.stringify(originalData.permissions)
    );
  };

  const permissionConfig = [
    {
      key: "products",
      label: "Manage Products",
      description: "Add, edit, and delete products",
      icon: Package,
      color: "blue",
    },
    {
      key: "orders",
      label: "Manage Orders",
      description: "View and process customer orders",
      icon: ShoppingCart,
      color: "green",
    },
    {
      key: "customers",
      label: "Manage Customers",
      description: "View and manage customer accounts",
      icon: Users,
      color: "purple",
    },
    {
      key: "team",
      label: "Manage Team",
      description: "Manage team members and roles",
      icon: User,
      color: "orange",
    },
    {
      key: "analytics",
      label: "View Analytics",
      description: "Access reports and analytics",
      icon: Activity,
      color: "indigo",
    },
    {
      key: "content",
      label: "Manage Content",
      description: "Edit website content and blog posts",
      icon: FileText,
      color: "pink",
    },
    {
      key: "settings",
      label: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "gray",
    },
  ];

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
            onClick={() => navigate("/admin-roles")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Edit Admin Role
            </h1>
            <p className="text-gray-600 mt-1">
              Modify role permissions and settings
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

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Permissions
                </h2>
                <p className="text-sm text-gray-600">
                  Select the permissions for this role
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionConfig.map((perm) => {
                const Icon = perm.icon;
                const isChecked = permissions[perm.key];

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
                      checked={isChecked}
                      onChange={() => handleCheckbox(perm.key)}
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

          {/* Role Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Role Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Role Name</p>
                  <p className="font-medium">{roleName || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {status === "Active" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Permissions</p>
                  <p className="font-medium">
                    {Object.values(permissions).filter(Boolean).length} of{" "}
                    {Object.keys(permissions).length}
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
              Delete Role
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin-roles")}
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

export default EditAdminRole;
