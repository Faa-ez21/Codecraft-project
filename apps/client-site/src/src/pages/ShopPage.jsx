// ShopPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";



const categories = [
  'Desks', 'Chairs', 'Storage', 'Accessories', 'Ergonomic Solutions'
];

const filters = [
  { label: 'Material', options: ['Wood', 'Metal', 'Plastic'] },
  { label: 'Color', options: ['Black', 'White', 'Brown'] },
];

const products = {
  'Best Sellers': [
    { name: 'Ergonomic Office Chair', rating: 5, img: '/products/chair1.png' },
    { name: 'Adjustable Height Desk', rating: 5, img: '/products/desk1.png' },
    { name: 'Mesh Back Chair', rating: 4, img: '/products/chair2.png' },
    { name: 'Executive Office Desk', rating: 5, img: '/products/desk2.png' },
  ],
  Desks: [
    { name: 'Adjustable Height Desk', rating: 5, img: '/products/desk1.png' },
    { name: 'Executive Office Desk', rating: 5, img: '/products/desk2.png' },
    { name: 'Standing Desk Converter', rating: 4, img: '/products/desk3.png' },
    { name: 'Compact Workstation', rating: 3, img: '/products/desk4.png' },
  ],
  Chairs: [
    { name: 'Ergonomic Office Chair', rating: 5, img: '/products/chair1.png' },
    { name: 'Mesh Back Chair', rating: 4, img: '/products/chair2.png' },
    { name: 'Leather Executive Chair', rating: 5, img: '/products/chair3.png' },
    { name: 'Task Chair', rating: 3, img: '/products/chair4.png' },
  ],
  Storage: [
    { name: 'Filing Cabinet', rating: 4, img: '/products/storage1.png' },
    { name: 'Bookcase', rating: 4, img: '/products/storage2.png' },
    { name: 'Mobile Pedestal', rating: 3, img: '/products/storage3.png' },
    { name: 'Wall-Mounted Shelves', rating: 5, img: '/products/storage4.png' },
  ],
  Accessories: [
    { name: 'Monitor Arm', rating: 4, img: '/products/acc1.png' },
    { name: 'Keyboard Tray', rating: 4, img: '/products/acc2.png' },
    { name: 'Cable Management Kit', rating: 4, img: '/products/acc3.png' },
    { name: 'Desk Lamp', rating: 3, img: '/products/acc4.png' },
  ],
  'Ergonomic Solutions': [
    { name: 'Footrest', rating: 5, img: '/products/ergo1.png' },
    { name: 'Wrist Rest', rating: 4, img: '/products/ergo2.png' },
    { name: 'Back Support Cushion', rating: 4, img: '/products/ergo3.png' },
    { name: 'Balance Board', rating: 4, img: '/products/ergo4.png' },
  ]
};

const StarRating = ({ rating }) => (
  <div className="text-yellow-500 text-xs">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
);

const ProductCard = ({ name, rating, img }) => (
  <div className="w-full max-w-[170px] group cursor-pointer">
    <div className="bg-white rounded-lg overflow-hidden relative">
      <img src={img} alt={name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
      <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Quick View
      </button>
    </div>
    <div className="pt-2 text-xs">
      <p className="truncate font-medium">{name}</p>
      <StarRating rating={rating} />
    </div>
  </div>
);

const ShopPage = () => {
  return (
    <div className="bg-[#E4E7EB] min-h-screen text-gray-900">
      {/* Header */}
        <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row px-4 md:px-6 py-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-[240px] text-sm">
          <h2 className="font-semibold mb-3">Categories</h2>
          <ul className="mb-6 space-y-2">
            {categories.map((cat) => (
              <li key={cat} className="cursor-pointer hover:underline flex items-center justify-between">
                {cat} <span>{'>'}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-semibold mb-2">Filter</h2>
          <label className="text-xs">Price Range</label>
          <input type="range" className="w-full mt-1 mb-4" />

          {filters.map((f) => (
            <div key={f.label} className="mb-4">
              <label className="block text-xs mb-1">{f.label}</label>
              <select className="w-full text-xs px-3 py-1 bg-[#2C2F2E] text-white rounded-md">
                <option>Select {f.label}</option>
                {f.options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <h2 className="text-xl font-semibold mb-1">Products</h2>
          <p className="text-xs text-gray-600 mb-6">Explore our range of office furniture designed for comfort and productivity.</p>

          {Object.entries(products).map(([section, items]) => (
            <section key={section} className="mb-10">
              <h3 className="text-sm font-semibold mb-3">{section}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                  <ProductCard key={item.name} {...item} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShopPage;
