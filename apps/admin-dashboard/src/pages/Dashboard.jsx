import { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  ShoppingCart,
  Package,
  Users,
  Star,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import StatCard from "../components/StatCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [categorySales, setCategorySales] = useState({});
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          ordersRes,
          productsRes,
          customersRes,
          recentOrdersRes,
          lowStockRes,
        ] = await Promise.all([
          supabase.from("orders").select("*"),
          supabase.from("products").select("*"),
          supabase.from("customers").select("*"),
          supabase
            .from("orders")
            .select("id, customer_name, total, status, created_at")
            .order("created_at", { ascending: false })
            .limit(8),
          supabase
            .from("products")
            .select("id, name, stock_quantity")
            .lt("stock_quantity", 10),
        ]);

        if (!ordersRes.error) {
          setOrdersCount(ordersRes.data.length);
          const salesByMonth = groupSalesByMonth(ordersRes.data);
          setMonthlySales(salesByMonth);

          const revenue = ordersRes.data.reduce(
            (sum, order) => sum + (parseFloat(order.total) || 0),
            0
          );
          setTotalRevenue(revenue);

          // Calculate growth (mock calculation)
          setSalesGrowth(12.5);

          // Calculate order status distribution
          const stats = ordersRes.data.reduce((acc, order) => {
            const status = order.status?.toLowerCase() || "pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          setOrderStats(stats);
        }

        if (!productsRes.error) {
          setProductsCount(productsRes.data.length);
          const categoryData = groupByCategory(productsRes.data);
          setCategorySales(categoryData);
        }

        if (!customersRes.error) setCustomersCount(customersRes.data.length);
        if (!recentOrdersRes.error) setRecentOrders(recentOrdersRes.data);
        if (!lowStockRes.error) setLowStockItems(lowStockRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupSalesByMonth = (orders) => {
    const sales = {};
    for (const order of orders) {
      const date = new Date(order.created_at);
      const month = date.toLocaleString("default", { month: "short" });
      sales[month] = (sales[month] || 0) + (parseFloat(order.total) || 0);
    }
    const orderedMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return orderedMonths.map((month) => sales[month] || 0);
  };

  const groupByCategory = (products) => {
    const result = {};
    for (const item of products) {
      const category = item.category || "Uncategorized";
      result[category] = (result[category] || 0) + 1;
    }
    return result;
  };

  // Enhanced Chart Data
  const barData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        label: "Products by Category",
        data: Object.values(categorySales),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(249, 115, 22)",
          "rgb(168, 85, 247)",
          "rgb(236, 72, 153)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Revenue (GH₵)",
        data: monthlySales,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ["Delivered", "Processing", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          orderStats.delivered || 0,
          orderStats.processing || 0,
          orderStats.pending || 0,
          orderStats.cancelled || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(249, 115, 22)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last 30 days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`GH₵ ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          change="+12.5%"
          changeType="increase"
          subtitle="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Total Orders"
          value={ordersCount.toLocaleString()}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="blue"
          change="+8.2%"
          changeType="increase"
          subtitle="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Products"
          value={productsCount.toLocaleString()}
          icon={<Package className="w-6 h-6" />}
          color="purple"
          change="+3.1%"
          changeType="increase"
          subtitle="active products"
          isLoading={loading}
        />
        <StatCard
          title="Customers"
          value={customersCount.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          change="+15.3%"
          changeType="increase"
          subtitle="total registered"
          isLoading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Overview"
            subtitle="Monthly sales performance"
            type="line"
            data={lineData}
            options={chartOptions}
            isLoading={loading}
          />
        </div>

        {/* Order Status Chart */}
        <ChartCard
          title="Order Status"
          subtitle="Current order distribution"
          type="doughnut"
          data={doughnutData}
          options={{ ...chartOptions, scales: {} }}
          isLoading={loading}
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={recentOrders} isLoading={loading} />
        <LowStockTable items={lowStockItems} isLoading={loading} />
      </div>
    </div>
  );
}

// Enhanced Chart Component
function ChartCard({ title, subtitle, type, data, options, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-2/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="h-64">
        {type === "bar" && <Bar data={data} options={options} />}
        {type === "line" && <Line data={data} options={options} />}
        {type === "doughnut" && <Doughnut data={data} options={options} />}
      </div>
    </div>
  );
}

// Enhanced Recent Orders Table
function RecentOrdersTable({ orders, isLoading }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-600 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Orders
        </h3>
        <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
          View all <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="space-y-3">
          {orders.slice(0, 6).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {order.customer_name || "Guest Customer"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  GH₵ {parseFloat(order.total || 0).toFixed(2)}
                </p>
                <span
                  className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {order.status || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Low Stock Table
function LowStockTable({ items, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-600 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Stock Alert
          </h3>
        </div>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
          {items.length} items
        </span>
      </div>

      <div className="space-y-3">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Product ID: {item.id}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                  item.stock_quantity <= 3
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {item.stock_quantity} left
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            All products are well stocked!
          </p>
        </div>
      )}
    </div>
  );
}
