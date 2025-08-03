import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function UserBehavior() {
  const [behaviorData, setBehaviorData] = useState([]);
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(""); // "" = all months
  const [loading, setLoading] = useState(true);

  const userMetrics = [
    { label: "Page Views", key: "page_views" },
    { label: "Session Duration", key: "session_duration" },
    { label: "Bounce Rate", key: "bounce_rate" },
    { label: "Returning Users", key: "returning_users" },
  ];

  const descriptions = [
    {
      title: "User Engagement",
      description: "Tracks how users interact with your site, including page views and average session time.",
    },
    {
      title: "Retention",
      description: "Measures how many users return to your site after their first visit.",
    },
    {
      title: "Bounce Rate",
      description: "Shows the percentage of users who leave the site after viewing only one page.",
    },
  ];

  const fetchData = async () => {
    setLoading(true);

    let query = supabase.from("user_behavior").select("*");

    if (year) {
      query = query.gte("date", `${year}-${month || "01"}-01`).lte("date", `${year}-${month || "12"}-31`);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      console.error("Error fetching user behavior:", error);
    } else {
      setBehaviorData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const formatDuration = (interval) => {
    if (!interval || !interval.seconds) return "0s";
    const minutes = Math.floor(interval.seconds / 60);
    const seconds = interval.seconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const chartLabels = behaviorData.map(item => dayjs(item.date).format("MMM D"));

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">User Behavior</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Analyze how users interact with your platform to optimize engagement and retention.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {[2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }).map((_, idx) => (
            <option key={idx + 1} value={String(idx + 1).padStart(2, "0")}>
              {dayjs().month(idx).format("MMMM")}
            </option>
          ))}
        </select>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {descriptions.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{card.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Behavior Metrics */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Behavior Metrics (Latest)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {userMetrics.map((metric, index) => {
            const latest = behaviorData.at(-1);
            const value = latest
              ? metric.key === "session_duration"
                ? formatDuration(latest[metric.key])
                : metric.key === "bounce_rate"
                ? `${parseFloat(latest[metric.key]).toFixed(1)}%`
                : latest[metric.key]
              : "-";
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-all"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Page Views Trend</h2>
        <Line
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: "Page Views",
                data: behaviorData.map(item => item.page_views),
                borderColor: "rgba(16, 185, 129, 1)",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.3,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1000,
                },
              },
            },
          }}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Bounce Rate & Session Duration
        </h2>
        <Bar
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: "Bounce Rate (%)",
                data: behaviorData.map(item => parseFloat(item.bounce_rate || 0).toFixed(2)),
                backgroundColor: "rgba(239, 68, 68, 0.6)",
                yAxisID: "y-bounce",
              },
              {
                label: "Session Duration (mins)",
                data: behaviorData.map(item =>
                  ((item.session_duration?.seconds ?? 0) / 60).toFixed(2)
                ),
                backgroundColor: "rgba(59, 130, 246, 0.6)",
                yAxisID: "y-duration",
              },
            ],
          }}
          options={{
            responsive: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: { position: "top" },
            },
            scales: {
              "y-bounce": {
                type: "linear",
                position: "left",
                beginAtZero: true,
                title: { display: true, text: "Bounce Rate (%)" },
              },
              "y-duration": {
                type: "linear",
                position: "right",
                beginAtZero: true,
                title: { display: true, text: "Session Duration (mins)" },
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
