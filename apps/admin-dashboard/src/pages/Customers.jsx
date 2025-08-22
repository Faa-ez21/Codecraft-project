import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Star,
  Grid,
  List,
  MoreVertical,
  Eye,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Try to fetch from customers table with better error handling
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          id,
          name,
          email,
          phone,
          location,
          orders,
          spent,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching customers:", error);

        // Check if it's a network/CORS error vs a database error
        if (
          error.message?.includes("NetworkError") ||
          error.message?.includes("CORS")
        ) {
          console.log(
            "Network/CORS issue detected, using sample data for development"
          );
          // Use sample data for CORS/network issues
          const sampleCustomers = [
            {
              id: "1",
              name: "John Doe",
              email: "john.doe@email.com",
              phone: "+233 20 123 4567",
              location: "Accra, Ghana",
              orders: 3,
              spent: 2500.0,
              created_at: new Date().toISOString(),
              status: "active",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane.smith@email.com",
              phone: "+233 24 789 0123",
              location: "Kumasi, Ghana",
              orders: 1,
              spent: 850.0,
              created_at: new Date().toISOString(),
              status: "active",
            },
          ];
          setCustomers(sampleCustomers);
        } else {
          // For other errors, set empty array
          setCustomers([]);
        }
      } else {
        // Transform data to ensure all required fields exist
        const transformedCustomers = (data || []).map((customer) => ({
          ...customer,
          phone: customer.phone || "Not provided",
          location: customer.location || "Not provided",
          orders: customer.orders || 0,
          spent: customer.spent || 0,
          role: "customer",
          status: "active",
        }));
        setCustomers(transformedCustomers);
        console.log(
          `Successfully loaded ${transformedCustomers.length} customers from database`
        );
      }
    } catch (error) {
      console.error("Unexpected error fetching customers:", error);

      // Check if it's a network error
      if (
        error.message?.includes("NetworkError") ||
        error.message?.includes("fetch")
      ) {
        console.log("Network error detected, using sample data");
        const sampleCustomers = [
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+233 20 123 4567",
            location: "Accra, Ghana",
            orders: 3,
            spent: 2500.0,
            created_at: new Date().toISOString(),
            status: "active",
          },
        ];
        setCustomers(sampleCustomers);
      } else {
        setCustomers([]);
      }
    }
    setLoading(false);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.orders > 0).length,
    newThisMonth: customers.filter((c) => {
      if (!c.created_at) return false; // Skip if no created_at
      try {
        const created = new Date(c.created_at);
        const now = new Date();
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      } catch (error) {
        return false; // Skip if invalid date
      }
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + (Number(c.spent) || 0), 0),
  };

  // Debug logging
  console.log("Customers data:", {
    customersCount: customers.length,
    filteredCount: filteredCustomers.length,
    loading,
    sampleCustomer: customers[0],
    availableFields: customers[0] ? Object.keys(customers[0]) : [],
    stats,
  });

  // Debug logging
  console.log("Customers data:", {
    customersCount: customers.length,
    filteredCount: filteredCustomers.length,
    loading,
    sampleCustomer: customers[0],
    availableFields: customers[0] ? Object.keys(customers[0]) : [],
    stats,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Customer Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your customer relationships and track engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 transition-transform duration-300 ${
                    loading ? "animate-spin" : "group-hover:rotate-180"
                  }`}
                />
                Refresh
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group">
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                Export Data
              </button>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group">
                <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Total Customers",
              value: stats.total,
              icon: Users,
              color: "from-blue-500 to-cyan-500",
              change: "+12%",
            },
            {
              title: "Active Customers",
              value: stats.active,
              icon: Star,
              color: "from-green-500 to-emerald-500",
              change: "+8%",
            },
            {
              title: "New This Month",
              value: stats.newThisMonth,
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500",
              change: "+15%",
            },
            {
              title: "Total Revenue",
              value: `₵${stats.totalRevenue.toFixed(2)}`,
              icon: () => (
                <span className="w-6 h-6 flex items-center justify-center text-lg font-bold">
                  ₵
                </span>
              ),
              color: "from-yellow-500 to-orange-500",
              change: "+22%",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-green-500 text-xs font-semibold mt-1">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                >
                  {typeof stat.icon === "function" ? (
                    <stat.icon />
                  ) : (
                    <stat.icon className="w-6 h-6" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="spent">Sort by Total Spent</option>
                <option value="orders">Sort by Orders</option>
                <option value="location">Sort by Location</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Orders
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Spent
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Joined
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`border-t border-gray-100 hover:bg-green-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.name
                              ? customer.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <Link
                              to={`/customers/${customer.id}`}
                              className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-200"
                            >
                              {customer.name}
                            </Link>
                            <p className="text-sm text-gray-500">
                              ID: {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {customer.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {customer.phone || "Not provided"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer.location || "Not provided"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">
                            {customer.orders || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 text-gray-400">₵</span>
                          <span className="font-bold text-green-600">
                            ₵{customer.spent || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer.created_at
                              ? new Date(
                                  customer.created_at
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && !loading && (
                    <tr>
                      <td colSpan="7" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">
                              {customers.length === 0
                                ? "No customers found in the database"
                                : "No customers match your search criteria"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {customers.length === 0
                                ? "Users with 'customer' role will appear here, or check if customers table exists"
                                : "Try adjusting your search terms or filters"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                      {customer.name
                        ? customer.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {customer.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Orders:</span>
                      <span className="font-medium text-gray-800">
                        {customer.orders || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Spent:</span>
                      <span className="font-bold text-green-600">
                        ₵{customer.spent || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Joined:</span>
                      <span className="text-gray-700">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/customers/${customer.id}`}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-center text-sm font-medium block group-hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
