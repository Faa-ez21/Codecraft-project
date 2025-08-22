import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  getAllUsers,
  deleteCustomer,
  deleteAdmin,
  createMissingCustomerRecord,
} from "../utils/adminUtils";
import {
  Users,
  Shield,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function UserManagement() {
  const { user, userType } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userType === "admin") {
      loadUsers();
    }
  }, [userType]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { customers, admins } = await getAllUsers();
      setCustomers(customers);
      setAdmins(admins);
    } catch (error) {
      console.error("Error loading users:", error);
      setMessage("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    setActionLoading(customerId);
    try {
      const success = await deleteCustomer(customerId);
      if (success) {
        setMessage("Customer deleted successfully");
        loadUsers();
      } else {
        setMessage("Failed to delete customer");
      }
    } catch (error) {
      setMessage("Error deleting customer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    setActionLoading(adminId);
    try {
      const success = await deleteAdmin(adminId);
      if (success) {
        setMessage("Admin deleted successfully");
        loadUsers();
      } else {
        setMessage("Failed to delete admin");
      }
    } catch (error) {
      setMessage("Error deleting admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateMissingRecord = async (email) => {
    setActionLoading(email);
    try {
      // This is a simplified approach - in reality you'd need to get the auth user first
      setMessage(
        "This feature requires auth user data. Please use the recovery option on login page."
      );
    } catch (error) {
      setMessage("Error creating missing record");
    } finally {
      setActionLoading(null);
    }
  };

  if (userType !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Only administrators can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              User Management
            </h1>
            <button
              onClick={loadUsers}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">{message}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customers */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Customers ({customers.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {customers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No customers found
                    </p>
                  ) : (
                    customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {customer.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Orders: {customer.orders} | Spent: ${customer.spent}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          disabled={actionLoading === customer.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          {actionLoading === customer.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Admins */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  Admins ({admins.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {admins.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No admins found
                    </p>
                  ) : (
                    admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {admin.name}
                          </h3>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <p className="text-xs text-gray-500">
                            Role: {admin.role} | Status: {admin.status}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          disabled={
                            actionLoading === admin.id || admin.id === user?.id
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === admin.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Testing Auth Recovery
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>To test the recovery feature:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Delete a customer record from the database (using delete
                  button above)
                </li>
                <li>
                  Try to sign up with the same email - you'll get the "already
                  registered" error
                </li>
                <li>
                  Go to the login page and try to log in - you'll see the
                  "Recover Account" option
                </li>
                <li>
                  Click "Recover Account" to restore the missing database record
                </li>
              </ol>
              <p className="mt-3">
                <strong>Note:</strong> This only works if the Supabase Auth
                record still exists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
