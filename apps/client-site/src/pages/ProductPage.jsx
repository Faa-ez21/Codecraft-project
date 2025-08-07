import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-green-800 mb-4 font-medium">
        Products / Ergonomic Chairs
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-900 mb-6">Ergonomic Office Chair</h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <img
          src="/images/ergonomic-chair.png"
          alt="Ergonomic Office Chair"
          className="rounded-lg shadow-lg border border-yellow-400"
        />

        {/* Product Info */}
        <div>
          <p className="text-gray-700 mb-4">
            The ErgoComfort Chair provides optimal support and comfort during long hours. Adjustable lumbar support and breathable mesh back improve posture and reduce strain.
          </p>

          {/* Features */}
          <h2 className="text-lg font-semibold text-green-800 mb-2">Key Features</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-800">
            <li>✔️ Lumbar Support</li>
            <li>✔️ Mesh Back</li>
            <li>✔️ Padded Armrests</li>
            <li>✔️ Tilt Lock</li>
            <li>✔️ Durable Build</li>
            <li>✔️ Improved Comfort</li>
          </ul>

          {/* Dimensions */}
          <div className="mt-4 text-sm text-gray-700">
            <p><strong>Height:</strong> 45-50 in</p>
            <p><strong>Width:</strong> 27 in</p>
            <p><strong>Depth:</strong> 25 in</p>
          </div>

          {/* Color Options */}
          <div className="mt-6">
            <h3 className="font-semibold text-green-800 mb-2">Color Options</h3>
            <div className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-black border"></span>
              <span className="h-6 w-6 rounded-full bg-white border"></span>
              <span className="h-6 w-6 rounded-full bg-gray-400 border"></span>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 flex items-center gap-2 shadow">
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Customer Reviews</h2>
        <div className="flex items-center mb-4 text-yellow-500">
          {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          <Star size={16} />
          <span className="text-gray-700 ml-2">(4.5/5 - 120 reviews)</span>
        </div>

        <div className="space-y-6 text-sm text-gray-700">
          <div>
            <p className="font-bold">Sophia Bennett</p>
            <p className="text-gray-500">2 months ago</p>
            <p>This chair completely changed my posture. I don’t get back pain anymore!</p>
          </div>
          <div>
            <p className="font-bold">Ethan Carter</p>
            <p className="text-gray-500">3 months ago</p>
            <p>Great chair overall. Very comfy, just wish the arms were softer.</p>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['Standing Desk', 'Monitor Arm', 'Keyboard Tray'].map((title, i) => (
            <div key={i} className="bg-white border-t-4 border-yellow-500 shadow rounded p-4 text-center">
              <div className="h-32 bg-gray-100 mb-4 rounded" />
              <h3 className="font-medium text-green-800">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">Enhance posture & comfort</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
