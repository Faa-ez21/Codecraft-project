// src/pages/TopProducts.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopProducts() {
      setLoading(true);

      // Fetch the most recent month’s top 5 products
      const { data: latestMonthData, error } = await supabase
        .from("top_product_metrics")
        .select(
          "product_id, revenue, performance_percent, rank, month, products(name)"
        )
        .eq("month", new Date().toISOString().slice(0, 7) + "-01") // First day of current month
        .order("rank", { ascending: true })
        .limit(5);

      if (error) {
        console.error("Error fetching top product metrics:", error);
      } else {
        setTopProducts(latestMonthData);
        const revenueSum = latestMonthData.reduce((sum, item) => sum + parseFloat(item.revenue), 0);
        setTotalRevenue(revenueSum);
        setGrowth(15); // Static for now. You could calculate growth comparing months
      }

      setLoading(false);
    }

    fetchTopProducts();
  }, []);

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
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            GHS {totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">Last Month • +{growth}%</p>
        </div>
        <span className="mt-4 sm:mt-0 inline-block text-sm text-gray-400 dark:text-gray-500">
          Revenue from top 5 products
        </span>
      </div>

      {/* Product Progress Bars */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          {topProducts.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-base font-medium text-gray-800 dark:text-white">
                  {item.products?.name || "Unknown Product"}
                </p>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {item.performance_percent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 bg-green-500 rounded-full transition-all duration-700"
                  style={{ width: `${item.performance_percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
