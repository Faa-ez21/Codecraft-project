import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch orders:", error.message);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(searchTerm)
  );

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="p-4">Order ID</th>
              <th>Date</th>
              <th>User ID</th>
              <th>Payment Status</th>
              <th>Fulfillment Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <td className="p-4">#{order.id.slice(0, 8)}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.user_id?.slice(0, 8) || "Guest"}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {order.payment_status || "Pending"}
                  </span>
                </td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {order.fulfillment_status || "Processing"}
                  </span>
                </td>
                <td>GH₵ {order.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder (optional) */}
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
