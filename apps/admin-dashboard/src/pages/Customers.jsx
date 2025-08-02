import { Link } from "react-router-dom";

const customers = [
  {
    id: "123456",
    name: "Aisha Mensah",
    email: "aisha.mensah@email.com",
    phone: "+233 555 123 456",
    location: "Accra, Ghana",
    orders: 5,
    spent: "GHC 500",
    status: "Active",
  },
  {
    id: "654321",
    name: "Kwame Boateng",
    email: "kwame.boateng@email.com",
    phone: "+233 244 987 654",
    location: "Kumasi, Ghana",
    orders: 3,
    spent: "GHC 300",
    status: "Inactive",
  },
];

export default function Customers() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Customers
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="Search customers"
          className="border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
        />
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
              >
                <td className="p-3">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="text-green-700 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{customer.orders}</td>
                <td>{customer.spent}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
