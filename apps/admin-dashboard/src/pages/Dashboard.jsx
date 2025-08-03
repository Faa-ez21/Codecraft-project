import { useEffect, useState } from "react";
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
import { supabase } from "../lib/supabaseClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [categorySales, setCategorySales] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes, customersRes, recentOrdersRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("products").select("*"),
        supabase.from("customers").select("*"),
        supabase.from("orders").select("id, customer_name, total, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("id, name, stock_quantity").lt("stock_quantity", 5),
      ]);

      if (!ordersRes.error) {
        setOrdersCount(ordersRes.data.length);
        const salesByMonth = groupSalesByMonth(ordersRes.data);
        setMonthlySales(salesByMonth);
      }

      if (!productsRes.error) {
        setProductsCount(productsRes.data.length);
        const categoryData = groupByCategory(productsRes.data);
        setCategorySales(categoryData);
      }

      if (!customersRes.error) setCustomersCount(customersRes.data.length);
      if (!recentOrdersRes.error) setRecentOrders(recentOrdersRes.data);
      if (!lowStockRes.error) setLowStockItems(lowStockRes.data);
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
    const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

  // ChartJS data from dynamic state
  const barData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        label: "Products",
        data: Object.values(categorySales),
        backgroundColor: "#0A5F38",
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales (GH₵)",
        data: monthlySales,
        borderColor: "#0A5F38",
        backgroundColor: "rgba(10,95,56,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const barOptions = { responsive: true, plugins: { legend: { display: false } } };
  const lineOptions = { responsive: true, plugins: { legend: { display: true, position: "bottom" } } };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<ShoppingCart />} label="Orders" value={ordersCount} />
        <StatCard icon={<Package />} label="Products" value={productsCount} />
        <StatCard icon={<Users />} label="Customers" value={customersCount} />
        <StatCard icon={<Star />} label="Reviews" value="1,120" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Top Categories" type="bar" data={barData} options={barOptions} />
        <ChartCard title="Monthly Sales" type="line" data={lineData} options={lineOptions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={recentOrders} />
        <LowStockTable items={lowStockItems} />
      </div>
    </div>
  );
}



// --- Reusable components ---

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center">
      <div className="text-green-700 w-8 h-8 mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
    </div>
  );
}

function ChartCard({ title, type, data, options }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {type === "bar" ? <Bar data={data} options={options} /> : <Line data={data} options={options} />}
    </div>
  );
}

function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-600">
            <th className="pb-3">Customer</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="py-2">{order.customer_name || "N/A"}</td>
              <td>{order.total || "GH₵ 0"}</td>
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
                  {order.status || "Unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LowStockTable({ items }) {
  return (
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
          {items.map((item) => (
            <tr key={item.id} className="border-b last:border-none">
              <td className="py-2">{item.name}</td>
              <td className={`py-2 font-medium ${item.stock_quantity <= 3 ? "text-red-500" : "text-yellow-500"}`}>
                {item.stock_quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
