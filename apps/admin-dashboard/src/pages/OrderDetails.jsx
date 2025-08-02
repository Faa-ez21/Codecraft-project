import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();

  const order = {
    id,
    date: "September 15, 2023",
    customer: {
      name: "Aisha Mensah",
      email: "aisha.mensah@email.com",
      phone: "+233 555 123 456",
      address: "123 Accra Street, Accra, Ghana",
    },
    products: [
      { name: "Ergonomic Office Chair", qty: 1, price: "GH₵ 1,500" },
      { name: "Adjustable Standing Desk", qty: 1, price: "GH₵ 2,500" },
    ],
    subtotal: "GH₵ 4,000",
    shipping: "GH₵ 200",
    total: "GH₵ 4,200",
    shippingInfo: {
      method: "Standard Shipping",
      tracking: "GH1234567890",
      address: "123 Accra Street, Accra, Ghana",
    },
    payment: { method: "Mobile Money", status: "Paid" },
    status: "Fulfilled",
  };

  return (
    <div>
      <p className="text-gray-500 mb-2">
        <span className="text-green-700">Orders</span> / Order #{order.id}
      </p>
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <p className="text-gray-500 mb-6">Placed on {order.date}</p>

      {/* Customer Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
        <p>
          <strong>Customer Name:</strong> {order.customer.name}
        </p>
        <p>
          <strong>Email:</strong> {order.customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.customer.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.customer.address}
        </p>
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
            {order.products.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2">Subtotal: {order.subtotal}</p>
        <p>Shipping: {order.shipping}</p>
        <p className="font-bold">Total: {order.total}</p>
      </section>

      {/* Shipping Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
        <p>
          <strong>Shipping Method:</strong> {order.shippingInfo.method}
        </p>
        <p>
          <strong>Tracking Number:</strong> {order.shippingInfo.tracking}
        </p>
        <p>
          <strong>Delivery Address:</strong> {order.shippingInfo.address}
        </p>
      </section>

      {/* Payment Info */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
        <p>
          <strong>Payment Method:</strong> {order.payment.method}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.payment.status}
        </p>
      </section>
    </div>
  );
}
