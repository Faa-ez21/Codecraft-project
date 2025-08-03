import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching customer:", error.message);
      } else {
        setCustomer(data);
      }

      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading customer...</p>;
  }

  if (!customer) {
    return <p className="text-red-500 dark:text-red-400">Customer not found.</p>;
  }

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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Customer ID: {customer.id}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Contact Information
          </h3>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone || "—"}</p>
          <p>Location: {customer.location || "—"}</p>
        </div>

        {/* Spending & Orders */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Summary
          </h3>
          <p>Total Orders: {customer.orders ?? 0}</p>
          <p>Total Spent: GHC {customer.spent ?? 0}</p>
        </div>

        {/* Order History Placeholder */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Order History
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Order data will appear here once connected.
          </p>
        </div>
      </div>
    </div>
  );
}
