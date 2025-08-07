import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
    coupon,
    errorMessage,
    clearCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async () => {
    const success = await applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Header />

      <main className="flex-grow px-4 md:px-12 lg:px-24 py-10">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <div className="flex gap-2 mt-3 items-center">
                        <button
                          onClick={() => updateQuantity(item.id, 'decrease')}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 py-1">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 'increase')}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6 text-right">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 underline hover:text-red-700"
              >
                Clear Entire Cart
              </button>
            </div>

            {/* Coupon Section */}
            <div className="mt-10 bg-gray-50 p-6 rounded-lg">
              <label className="block mb-2 font-medium">Coupon Code</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="border p-2 rounded w-full sm:w-64"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Apply
                </button>
                {coupon && (
                  <button
                    onClick={clearCoupon}
                    className="text-red-600 underline hover:text-red-800 text-sm"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>

            {/* Summary Section */}
            <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <p className="text-gray-600 mb-4">
                You have <span className="font-semibold">{cartItems.length}</span> item(s) in your cart.
              </p>

              <Link to="/inquiry" state={{ fromCart: true }}>
                <button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow">
                  Proceed to Inquiry
                </button>
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
