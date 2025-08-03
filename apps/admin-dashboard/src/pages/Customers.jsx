import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from("customers").select("*");

      if (error) {
        console.error("Error fetching customers:", error.message);
      } else {
        setCustomers(data);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Customers
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
        />

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
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
                  <td>GHC {customer.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
