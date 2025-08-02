import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";
import { ShoppingCart, Package, Users, Star, AlertTriangle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // Bar chart for Top Categories
  const barData = {
    labels: ["Chairs", "Desks", "Storage", "Accessories", "Lighting"],
    datasets: [
      {
        label: "Sales",
        data: [120, 90, 70, 50, 30],
        backgroundColor: "#0A5F38",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  // Line chart for Monthly Sales
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Sales ($)",
        data: [3000, 4500, 4000, 6000, 7000, 8000, 9000, 8500],
        borderColor: "#0A5F38",
        backgroundColor: "rgba(10,95,56,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
    },
  };

  // Recent Orders
  const recentOrders = [
    { id: 1, customer: "John Doe", item: "Ergonomic Chair", amount: "$200", status: "Delivered" },
    { id: 2, customer: "Jane Smith", item: "Office Desk", amount: "$350", status: "Pending" },
    { id: 3, customer: "David Clark", item: "Filing Cabinet", amount: "$150", status: "Shipped" },
  ];

  // Low Stock Items
  const lowStockItems = [
    { id: 1, name: "Office Chair", stock: 5 },
    { id: 2, name: "Standing Desk", stock: 3 },
    { id: 3, name: "Bookshelf", stock: 2 },
    { id: 4, name: "Conference Table", stock: 1 },
  ];

  return (
    <div>
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <ShoppingCart className="text-green-700 w-8 h-8 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <h2 className="text-xl font-bold">1,240</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <Package className="text-green-700 w-8 h-8 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <h2 className="text-xl font-bold">320</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <Users className="text-green-700 w-8 h-8 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <h2 className="text-xl font-bold">540</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <Star className="text-green-700 w-8 h-8 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Reviews</p>
            <h2 className="text-xl font-bold">1,120</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2">{order.customer}</td>
                  <td>{order.item}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Item</th>
                <th className="py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="py-2">{item.name}</td>
                  <td className={`py-2 font-medium ${item.stock <= 3 ? "text-red-500" : "text-yellow-500"}`}>
                    {item.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
