import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";


const initialCartItems = [
  {
    id: 1,
    name: 'Ergonomic Office Chair',
    qty: 1,
    image: '/chair.png',
  },
  {
    id: 2,
    name: 'Adjustable Standing Desk',
    qty: 1,
    image: '/desk.png',
  },
  {
    id: 3,
    name: 'Blue Light Blocking Glasses',
    qty: 2,
    image: '/glasses.png',
  },
];

const suggestions = [
  {
    id: 1,
    name: 'Modern Desk Lamp',
    image: '/lamp.png',
  },
  {
    id: 2,
    name: 'Ergonomic Keyboard',
    image: '/keyboard.png',
  },
  {
    id: 3,
    name: 'Wireless Mouse',
    image: '/mouse.png',
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (id, type) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQty = type === 'increase' ? item.qty + 1 : item.qty - 1;
        return { ...item, qty: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen font-sans">
        <Header />
    <div className="px-6 md:px-20 py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-100 p-4 font-medium text-sm">
          <span>Product</span>
          <span className="col-span-1">Description</span>
          <span className="text-right">Subtotal</span>
        </div>

        {cartItems.map(item => (
          <div key={item.id} className="grid grid-cols-3 items-center border-t p-4">
            <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
            <span>{item.name}</span>
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

      <div className="mt-8">
        <label className="block mb-2 text-sm font-medium">Coupon Code</label>
        <input
          type="text"
          placeholder="Enter coupon code"
          className="border rounded-lg px-4 py-2 w-full max-w-md"
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
          Clear Cart
        </button>
        <button className="px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800">
          Update Cart
        </button>
      </div>

      <div className="mt-8">
        <button className="px-6 py-3 bg-green-700 text-white rounded-full text-lg hover:bg-green-800">
          Proceed to Checkout
        </button>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">You May Be Interested In</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {suggestions.map(product => (
            <div key={product.id} className="text-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
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
