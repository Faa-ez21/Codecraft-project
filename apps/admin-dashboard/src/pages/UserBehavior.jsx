// src/pages/UserBehavior.jsx

export default function UserBehavior() {
  const userMetrics = [
    { label: "Page Views", value: "12,400", change: "+8%", changeType: "positive" },
    { label: "Session Duration", value: "3m 45s", change: "+5%", changeType: "positive" },
    { label: "Bounce Rate", value: "40%", change: "-3%", changeType: "negative" },
    { label: "Returning Users", value: "2,300", change: "+12%", changeType: "positive" },
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

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">User Behavior</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Analyze how users interact with your platform to optimize engagement and retention.
        </p>
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

      {/* Metrics */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Behavior Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {userMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-all"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              <p
                className={`text-sm font-medium ${
                  metric.changeType === "positive" ? "text-green-500" : "text-red-500"
                }`}
              >
                {metric.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
