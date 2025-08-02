import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Chairs",
    image: "https://via.placeholder.com/40?text=Chair",
    category: "Chairs",
    price: "GHS 1,200",
    status: "In Stock",
    stock: 50,
  },
  {
    id: 2,
    name: "Desks",
    image: "https://via.placeholder.com/40?text=Desk",
    category: "Desks",
    price: "GHS 2,500",
    status: "Out of Stock",
    stock: 0,
  },
];

export default function ProductList() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <Link
          to="/add-product"
          className="bg-green-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-800"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr
                key={prod.id}
                className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  {prod.name}
                </td>
                <td className="p-3">{prod.category}</td>
                <td className="p-3">{prod.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      prod.status === "In Stock"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {prod.status}
                  </span>
                </td>
                <td className="p-3">{prod.stock}</td>
                <td className="p-3">
                  <Link
                    to={`/edit-product/${prod.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
