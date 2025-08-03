// src/pages/AnalyticsOverview.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { supabase } from '../lib/supabaseClient';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function AnalyticsOverview() {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("analytics_overview")
        .select("*")
        .eq("month", month)
        .eq("year", year)
        .single();

      if (!error) setStats(data);
    };

    const fetchMonthlyTrend = async () => {
      const { data, error } = await supabase
        .from("analytics_overview")
        .select("*")
        .eq("year", year)
        .order("month", { ascending: true });

      if (!error) setMonthlyData(data);
    };

    fetchStats();
    fetchMonthlyTrend();
  }, [month, year]);

  const insights = [
    {
      title: "Sales Performance",
      description: "Track sales trends, revenue, and order metrics.",
      link: "/analytics/sales-performance",
    },
    {
      title: "Top Products",
      description: "Identify best-selling items and popular categories.",
      link: "/analytics/top-products",
    },
    {
      title: "User Behavior",
      description: "Analyze site visits, user engagement, and conversion rates.",
      link: "/analytics/user-behavior",
    },
  ];

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const quickStats = stats
    ? [
        {
          label: "Total Revenue",
          value: `$${stats.total_revenue?.toLocaleString() || "0"}`,
          change: `${stats.revenue_growth || 0}%`,
          changeType: stats.revenue_growth >= 0 ? "positive" : "negative",
        },
        {
          label: "Orders Placed",
          value: stats.orders_placed?.toLocaleString(),
          change: `${stats.orders_growth || 0}%`,
          changeType: stats.orders_growth >= 0 ? "positive" : "negative",
        },
        {
          label: "Average Order Value",
          value: `$${stats.average_order_value?.toFixed(2)}`,
          change: `${stats.aov_growth || 0}%`,
          changeType: stats.aov_growth >= 0 ? "positive" : "negative",
        },
        {
          label: "Site Visits",
          value: stats.site_visits?.toLocaleString(),
          change: `${stats.visits_growth || 0}%`,
          changeType: stats.visits_growth >= 0 ? "positive" : "negative",
        },
      ]
    : [];

  const trendChartData = {
    labels: monthlyData.map((d) => months[d.month - 1]),
    datasets: [
      {
        label: "Total Revenue",
        data: monthlyData.map((d) => d.total_revenue),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Monitor key performance indicators for your business.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center mb-4">
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Month</label>
          <select
            className="block w-full mt-1 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="block w-full mt-1 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((card, index) => (
          <Link to={card.link} key={index}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{card.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p
                className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Revenue Trend</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <Line data={trendChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>
    </div>
  );
}
