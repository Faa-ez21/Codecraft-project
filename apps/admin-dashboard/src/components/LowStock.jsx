import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { AlertTriangle, Package } from "lucide-react";

const LowStock = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products with low stock (assuming stock_quantity <= 10 is considered low)
        const { data: products, error: fetchError } = await supabase
          .from("products")
          .select("id, name, stock_quantity, price")
          .lte("stock_quantity", 10)
          .order("stock_quantity", { ascending: true })
          .limit(10);

        if (fetchError) {
          console.error("Error fetching low stock items:", fetchError);
          setError("Failed to fetch stock data");
          return;
        }

        setItems(products || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-darkText mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Low Stock Items
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-darkText mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Low Stock Items
        </h3>
        <div className="flex items-center justify-center h-32 text-red-500">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <h3 className="text-lg font-semibold text-darkText mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2" />
        Low Stock Items
        {items.length > 0 && (
          <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
            {items.length}
          </span>
        )}
      </h3>

      {items.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>All items are well stocked!</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pr-4">Item</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-3 pr-4 text-darkText font-medium">
                    {item.name}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.stock_quantity <= 3
                          ? "bg-red-100 text-red-800"
                          : item.stock_quantity <= 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.stock_quantity <= 3 && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {item.stock_quantity} left
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">
                    ${parseFloat(item.price || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length >= 10 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Showing top 10 low stock items
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LowStock;
