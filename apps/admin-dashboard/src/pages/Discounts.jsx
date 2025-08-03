// src/pages/Discounts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscounts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("discounts")
        .select(
          "id, name, code, discount_type, discount_value, start_date, end_date, status"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching discounts:", error.message);
      } else {
        setDiscounts(data);
      }
      setLoading(false);
    }

    fetchDiscounts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discounts</h1>
        <Link
          to="/discounts/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          New Discount
        </Link>
      </div>

      {loading ? (
        <p>Loading discounts...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-sm">
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3">Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr
                  key={d.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">{d.name}</td>
                  <td>{d.code}</td>
                  <td>{d.discount_type}</td>
                  <td>
                    {d.discount_type === "Percentage"
                      ? `${d.discount_value}%`
                      : `₵${d.discount_value}`}
                  </td>
                  <td>{new Date(d.start_date).toLocaleDateString()}</td>
                  <td>{new Date(d.end_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        d.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/discounts/edit/${d.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
