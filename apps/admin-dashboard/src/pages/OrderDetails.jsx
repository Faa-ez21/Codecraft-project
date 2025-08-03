import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching order:", error.message);
      } else {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  // Optional: simulate product data if you don't yet store order-product relations
  const products = [
    { name: "Ergonomic Office Chair", qty: 1, price: 1500 },
    { name: "Adjustable Standing Desk", qty: 1, price: 2500 },
  ];

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shipping = 200;
  const total = subtotal + shipping;

  return (
    <div>
      <p className="text-gray-500 mb-2">
        <span className="text-green-700">Orders</span> / Order #{order.id.slice(0, 8)}
      </p>
      <h1 className="text-2xl font-bold mb-4">Order #{order.id.slice(0, 8)}</h1>
      <p className="text-gray-500 mb-6">
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </p>

      {/* Customer Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
        <p>
          <strong>User ID:</strong> {order.user_id || "Guest"}
        </p>
        {/* You can fetch user details from a users table if available */}
      </section>

      {/* Order Summary */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td>{item.qty}</td>
                <td>GH₵ {item.price}</td>
                <td>GH₵ {item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2">Subtotal: GH₵ {subtotal}</p>
        <p>Shipping: GH₵ {shipping}</p>
        <p className="font-bold">Total: GH₵ {total}</p>
      </section>

      {/* Shipping Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
        <p>
          <strong>Shipping Method:</strong> Standard Shipping
        </p>
        <p>
          <strong>Tracking Number:</strong> GH1234567890
        </p>
        <p>
          <strong>Delivery Address:</strong> 123 Accra Street, Accra, Ghana
        </p>
      </section>

      {/* Payment Info */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
        <p>
          <strong>Payment Method:</strong> Mobile Money
        </p>
        <p>
          <strong>Payment Status:</strong>{" "}
          {order.payment_status || "Pending"}
        </p>
        <p>
          <strong>Fulfillment Status:</strong>{" "}
          {order.fulfillment_status || "Processing"}
        </p>
      </section>
    </div>
  );
}
