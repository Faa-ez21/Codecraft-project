// src/pages/SalesPerformance.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SalesPerformance() {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const categories = ["Chairs", "Desks", "Sofas", "Lighting", "Decor"];

  useEffect(() => {
    async function fetchSalesData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("sales_metrics")
        .select("*")
        .order("month", { ascending: true });

      if (error) {
        console.error("Error fetching sales data:", error);
      } else if (data.length > 0) {
        const labels = data.map((row) => row.month);
        const sales = data.map((row) => row.total_sales);
        const growth = data[data.length - 1].growth_percent;
        const categorySales = data[data.length - 1].category_sales || {};

        setSalesData({
          labels,
          datasets: [
            {
              label: "Monthly Sales (GHS)",
              data: sales,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointRadius: 4,
            },
          ],
          growth,
          categorySales,
        });
      }

      setLoading(false);
    }

    fetchSalesData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sales Performance</h1>
        <p className="text-sm text-gray-500">
          Overview of sales trends and performance metrics
        </p>
      </div>

      {loading || !salesData ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Sales Trend */}
          <div className="border p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">Monthly Sales Trend</h2>
            <Line data={{ labels: salesData.labels, datasets: salesData.datasets }} />
            <p
              className={`text-sm mt-2 ${
                salesData.growth >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              Last 12 Months {salesData.growth >= 0 ? "+" : ""}
              {salesData.growth}%
            </p>
          </div>

          {/* Product Category Sales */}
          <div className="border p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">Product Category Sales</h2>
            <p className="text-2xl font-bold mt-2">
              GHS{" "}
              {Object.values(salesData.categorySales)
                .reduce((sum, v) => sum + v, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Category-wise breakdown</p>
            <div className="mt-4 space-y-2">
              {categories.map((cat, idx) => {
                const value = salesData.categorySales[cat] || 0;
                const max = Math.max(...Object.values(salesData.categorySales), 1);
                const percentage = (value / max) * 100;

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{cat}</span>
                    <div className="h-3 w-3/4 bg-gray-100 rounded-full">
                      <div
                        className="h-3 bg-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
