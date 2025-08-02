// src/pages/TopProducts.jsx

export default function TopProducts() {
  const topProducts = [
    { name: "Ergonomic Chair", percentage: 95 },
    { name: "Standing Desk", percentage: 90 },
    { name: "Adjustable Monitor Arm", percentage: 75 },
    { name: "Keyboard Tray", percentage: 90 },
    { name: "Footrest", percentage: 85 },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Top Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
          View the top-selling products based on performance metrics.
        </p>
      </div>

      {/* Revenue Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">$25,000</p>
          <p className="text-sm text-green-600 mt-1">Last Month • +15%</p>
        </div>
        <span className="mt-4 sm:mt-0 inline-block text-sm text-gray-400 dark:text-gray-500">
          Revenue from top 5 products
        </span>
      </div>

      {/* Product Progress Bars */}
      <div className="space-y-6">
        {topProducts.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-base font-medium text-gray-800 dark:text-white">{item.name}</p>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 bg-green-500 rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
