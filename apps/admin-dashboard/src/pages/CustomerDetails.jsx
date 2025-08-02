import { useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams();

  const customer = {
    name: "Aisha Mensah",
    email: "aisha.mensah@email.com",
    phone: "+233 555 123 456",
    address: "123 Accra Street, Osu",
    city: "Accra",
    joined: "2022-05-15",
    orders: [
      { id: "#789012", date: "2023-08-15", status: "Completed", total: "GHC 500" },
      { id: "#654321", date: "2023-07-20", status: "Shipped", total: "GHC 350" },
      { id: "#987654", date: "2023-06-05", status: "Completed", total: "GHC 750" },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Customer Details
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        {/* Profile */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://via.placeholder.com/80"
            alt={customer.name}
            className="rounded-full w-20 h-20 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">Customer ID: {id}</p>
            <p className="text-gray-500 dark:text-gray-400">Joined: {customer.joined}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Contact Information
          </h3>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
          <p>City: {customer.city}</p>
        </div>

        {/* Order History */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Order History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.date}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
