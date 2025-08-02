import React from "react";

const LowStock = () => {
  const items = [
    { name: "Office Chair", stock: 5 },
    { name: "Standing Desk", stock: 3 },
    { name: "Bookshelf", stock: 2 },
    { name: "Conference Table", stock: 1 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <h3 className="text-lg font-semibold text-darkText mb-4">Low Stock Items</h3>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Item</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="py-2 text-darkText">{item.name}</td>
              <td className={`py-2 font-medium ${item.stock <= 3 ? "text-red-500" : "text-yellow-500"}`}>
                {item.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStock;
