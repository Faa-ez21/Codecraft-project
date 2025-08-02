// src/pages/AnalyticsOverview.jsx
import { Link } from "react-router-dom";

export default function AnalyticsOverview() {
  const quickStats = [
    { label: "Total Revenue", value: "$250,000", change: "+10%", changeType: "positive" },
    { label: "Orders Placed", value: "1,200", change: "+5%", changeType: "positive" },
    { label: "Average Order Value", value: "$208", change: "-2%", changeType: "negative" },
    { label: "Site Visits", value: "5,000", change: "+8%", changeType: "positive" },
  ];

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

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Monitor key performance indicators for your business.
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
    </div>
  );
}
