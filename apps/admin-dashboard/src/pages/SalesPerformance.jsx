// src/pages/SalesPerformance.jsx

export default function SalesPerformance() {
  const categories = ["Chairs", "Desks", "Sofas", "Lighting", "Decor"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sales Performance</h1>
        <p className="text-sm text-gray-500">
          Overview of sales trends and performance metrics
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="border p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold">Monthly Sales Trend</h2>
          <p className="text-2xl font-bold mt-2">$25,000</p>
          <p className="text-sm text-green-600">Last 12 Months +15%</p>
          <div className="mt-4">
            <img src="/charts/sales-trend.png" alt="Monthly Sales Trend" />
            {/* Optional: Replace with Recharts or Chart.js */}
          </div>
        </div>

        {/* Product Category Sales */}
        <div className="border p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold">Product Category Sales</h2>
          <p className="text-2xl font-bold mt-2">$12,000</p>
          <p className="text-sm text-red-500">Current Month -5%</p>
          <div className="mt-4 space-y-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{cat}</span>
                <div className="h-3 w-3/4 bg-gray-100 rounded-full">
                  <div
                    className="h-3 bg-green-600 rounded-full"
                    style={{ width: `${70 + idx * 5}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
