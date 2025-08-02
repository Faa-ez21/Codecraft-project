import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();

  const orders = [
    { id: 1001, date: "July 12, 2024", customer: "Aisha Mensah", payment: "Paid", status: "Fulfilled", total: "GH₵ 2500" },
    { id: 1002, date: "July 11, 2024", customer: "Kwame Boateng", payment: "Paid", status: "Fulfilled", total: "GH₵ 1800" },
    { id: 1003, date: "July 10, 2024", customer: "Ecobank", payment: "Paid", status: "Fulfilled", total: "GH₵ 3200" },
    { id: 1004, date: "July 9, 2024", customer: "Yaw Asamoah", payment: "Paid", status: "Fulfilled", total: "GH₵ 1500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders</h1>
      <p className="text-green-700 mb-6">Manage your orders</p>

      {/* Tabs */}
      <div className="flex gap-6 mb-4 text-green-700 font-semibold">
        <span className="border-b-2 border-green-700 pb-1 cursor-pointer">All Orders</span>
        <span className="cursor-pointer text-gray-500">Drafts</span>
      </div>

      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg p-3 mb-6">
        <Search className="text-gray-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search orders"
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="p-4">Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Payment Status</th>
              <th>Fulfillment Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <td className="p-4">#{order.id}</td>
                <td>{order.date}</td>
                <td>{order.customer}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {order.payment}
                  </span>
                </td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {order.status}
                  </span>
                </td>
                <td>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4 text-gray-500">
        <button>&lt;</button>
        <span className="text-green-700 font-semibold">1</span>
        <span>2</span>
        <span>3</span>
        <span>...</span>
        <span>10</span>
        <button>&gt;</button>
      </div>
    </div>
  );
}
