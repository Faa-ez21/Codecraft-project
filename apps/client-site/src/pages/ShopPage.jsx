import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from '../components/header';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Desks', sub: ['Rectangular Desks', 'Executive Desks'] },
  { name: 'Swivel Chairs', sub: ['Ergonomic Swivel Chairs', 'Orthopedic Chairs', 'Standard Swivel Chairs',  'Canteen Chairs', 'Lecture Hall Chairs', 'Teller Chairs', 'Visitors Chairs'] },
  { name: 'Sofa', sub: [] },
  { name: 'Cabinets', sub: ['Metal Cabinets', 'Wooden Cabinets'] },
  { name: 'Ergonomic Solutions', sub: [] },
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
  'Rectangular Desks': [
    { name: 'Standing Desk Converter', rating: 4, img: '/products/desk3.png' },
  ],
  'Executive Desks': [
    { name: 'Executive Office Desk', rating: 5, img: '/products/desk2.png' },
  ],
  'Swivel Chairs': [
    { name: 'Ergonomic Office Chair', rating: 5, img: '/products/chair1.png' },
    { name: 'Mesh Back Chair', rating: 4, img: '/products/chair2.png' },
    { name: 'Leather Executive Chair', rating: 5, img: '/products/chair3.png' },
    { name: 'Task Chair', rating: 3, img: '/products/chair4.png' },
  ],
  'Ergonomic Swivel Chairs': [
    { name: 'Ergonomic Office Chair', rating: 5, img: '/products/chair1.png' },
  ],
  'Orthopedic Chairs': [
    { name: 'Leather Executive Chair', rating: 5, img: '/products/chair3.png' },
  ],
  'Standard Swivel Chairs': [
    { name: 'Standard Swivel Chair', rating: 4, img: '/products/chair4.png' },
  ],
  'Canteen Chairs': [
    { name: 'Canteen Chair', rating: 4, img: '/products/canteen1.png' },
  ],
  'Lecture Hall Chairs': [
    { name: 'Lecture Hall Chair', rating: 4, img: '/products/lecture1.png' },
  ],
  'Teller Chairs': [
    { name: 'Teller Chair', rating: 4, img: '/products/teller1.png' },
  ],
  'Visitors Chairs': [
    { name: 'Visitors Chair', rating: 4, img: '/products/visitor1.png' },
  ],
  'Cabinets': [
    { name: 'Filing Cabinet', rating: 4, img: '/products/storage1.png' },
    { name: 'Bookcase', rating: 4, img: '/products/storage2.png' },
    { name: 'Mobile Pedestal', rating: 3, img: '/products/storage3.png' },
    { name: 'Wall-Mounted Shelves', rating: 5, img: '/products/storage4.png' },
  ],
  'Metal Cabinets': [
    { name: 'Metal Filing Cabinet', rating: 4, img: '/products/storage5.png' },
    { name: 'Metal Bookcase', rating: 4, img: '/products/storage6.png' },
  ],
  'Wooden Cabinets': [
    { name: 'Wooden Filing Cabinet', rating: 4, img: '/products/storage7.png' },
    { name: 'Wooden Bookcase', rating: 4, img: '/products/storage8.png' },
  ],
  'Sofas': [
    { name: 'Gaming Sofa', rating: 4, img: '/products/acc1.png' },
    { name: 'Yellow Sofa', rating: 4, img: '/products/acc2.png' },
    { name: 'Red Sofa', rating: 4, img: '/products/acc3.png' },
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

const ProductCard = ({ name, rating, img }) => {
  const { addToCart } = useCart();

  return (
    <div className="w-full max-w-[170px] group cursor-pointer">
      <div className="bg-white rounded-lg overflow-hidden relative">
        <img
          src={img}
          alt={name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => addToCart({ name, rating, img })}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Add to Inquiry Cart
        </button>
      </div>
      <div className="pt-2 text-xs">
        <p className="truncate font-medium">{name}</p>
        <StarRating rating={rating} />
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Best Sellers');

  return (
    <div className="flex flex-col min-h-screen bg-[#E4E7EB] text-gray-900">
      <Header />

      <div className="flex flex-col lg:flex-row px-4 md:px-6 py-8 gap-6 flex-1">
        {/* Sidebar */}
        <aside className="w-full lg:w-[240px] text-sm">
          <h2 className="font-semibold mb-3">Categories</h2>
          <ul className="mb-6 space-y-2">
            <li
              onClick={() => setSelectedCategory('Best Sellers')}
              className={`cursor-pointer hover:underline ${
                selectedCategory === 'Best Sellers' ? 'font-bold text-green-700' : ''
              }`}
            >
              Best Sellers
            </li>
            {categories.map((cat) => (
              <li key={cat.name}>
                <div
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`cursor-pointer flex items-center justify-between hover:underline ${
                    selectedCategory === cat.name ? 'font-bold text-green-700' : ''
                  }`}
                >
                  {cat.name}
                  {cat.sub.length > 0 && <ChevronDown className="w-4 h-4" />}
                </div>
                {cat.sub.length > 0 && selectedCategory === cat.name && (
                  <ul className="pl-4 mt-1 space-y-1 text-xs text-gray-600">
                    {cat.sub.map((sub) => (
                      <li
                        key={sub}
                        onClick={() => setSelectedCategory(sub)}
                        className={`cursor-pointer hover:text-green-700 ${
                          selectedCategory === sub ? 'text-green-700 font-semibold' : ''
                        }`}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
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
                {f.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <h2 className="text-xl font-semibold mb-1">{selectedCategory}</h2>
          <p className="text-xs text-gray-600 mb-6">
            Explore our range of office furniture designed for comfort and productivity.
          </p>
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {(products[selectedCategory] || []).map((item) => (
                <ProductCard key={item.name} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
