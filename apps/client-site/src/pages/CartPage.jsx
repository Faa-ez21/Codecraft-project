import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from "../components/header";
import Footer from '../components/footer';

const suggestions = [
  { id: 1, name: 'Modern Desk Lamp', image: '/lamp.png' },
  { id: 2, name: 'Ergonomic Keyboard', image: '/keyboard.png' },
  { id: 3, name: 'Wireless Mouse', image: '/mouse.png' },
];

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');

  const handleQuantityChange = (id, type) => {
    updateQuantity(id, type);
  };

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    try {
      const res = await fetch(`/api/discounts?code=${code}`);
      const data = await res.json();

      if (res.ok && data && data.status === 'active') {
        const today = new Date();
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);

        if (today >= start && today <= end) {
          setDiscountMessage(`${data.name} (${data.discount_type}): ${data.discount_value}`);
        } else {
          setDiscountMessage('Coupon is expired or not yet active.');
        }
      } else {
        setDiscountMessage('Invalid or inactive coupon.');
      }
    } catch (err) {
      setDiscountMessage('Error validating coupon.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen font-sans">
      <Header />
      <div className="px-6 md:px-20 py-10">
        <h1 className="text-3xl font-semibold mb-6">Your Inquiry Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="border rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 p-4 font-medium text-sm">
                <span>Product</span>
                <span>Description</span>
                <span className="text-right">Quantity</span>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-3 items-center border-t p-4">
                  <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, 'decrease')}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 'increase')}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mt-8 max-w-md">
              <label className="block mb-2 text-sm font-medium">Discount Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter discount code"
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                >
                  Apply
                </button>
              </div>
              {discountMessage && (
                <p className={`mt-2 text-sm ${discountMessage.includes('Invalid') || discountMessage.includes('expired') ? 'text-red-600' : 'text-green-700'}`}>
                  {discountMessage}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button className="px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800">
                Update Cart
              </button>
            </div>

            <div className="mt-8">
              <button className="px-6 py-3 bg-green-700 text-white rounded-full text-lg hover:bg-green-800">
                Proceed to Inquire
              </button>
            </div>
          </>
        )}

        {/* Suggestions */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">You May Be Interested In</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestions.map(product => (
              <div key={product.id} className="text-center">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                <p>{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
