import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";
import swivel from "../assets/Swivel.jpg";
import Executivedesk from "../assets/ExecutiveDesk.jpg";
import Cabinet from "../assets/Cabinet.jpg";
import  Sofa  from "../assets/sofa.png";
import RectangularDesk from "../assets/RectangularDesk.jpg";
import Canteen from "../assets/Canteen Chair.JPG";
import Executivedesk2 from "../assets/ExecutiveDesk2.png";
import Executivedesk3 from "../assets/ExecutiveDesk3.jpg";
import Teller from "../assets/Teller.JPG";
import MetalCabinet from "../assets/MetalCabinet.jpg";
import MetalCabinet1 from "../assets/MetalCabinet1.jpg";
import Orthopedic from "../assets/Orthopedic.jpg";
import Sofa1 from "../assets/Sofa1.png";

// Sample products with categories
const products = [
  {
    id: 1,
    name: 'Ergonomic Swivel Chair',
    category: 'Chairs',
    image: swivel,
  },
  {
    id: 2,
    name: 'Executive Desk',
    category: 'Desks',
    image: Executivedesk,
  },
  {
    id: 3,
    name: 'Bookshelf Cabinet',
    category: 'Cabinets',
    image: Cabinet,
  },
  {
    id: 4,
    name: 'Sofa Set',
    category: 'Sofas',
    image: Sofa,
  },
  {
    id: 5,
    name: 'Rectangular Desk',
    category: 'Desks',
    image: RectangularDesk,
  },
  // Add more products as needed
  {
    id: 6,
    name: 'Canteen Chair',
    category: 'Chairs',
    image: Canteen,
  },
  {
    id: 7,
    name: 'Executive Desk',
    category: 'Desks',
    image: Executivedesk2,
  },
  {
    id: 8,
    name: 'Luxury Sofa',
    category: 'Sofas',
    image: Sofa1,
  },
  {
    id: 9,
    name: 'Executive Desk',
    category: 'Desks',
    image: Executivedesk3,
  },
  {
    id: 10,
    name: 'Orthopedic Chair',
    category: 'Chairs',
    image: Orthopedic,
  },
  {
    id: 11,
    name: 'Teller',
    category: 'Chairs',
    image: Teller,
  },
  {
    id: 12,
    name: 'Metal Cabinet',
    category: 'Cabinets',
    image: MetalCabinet,
  },
  {
    id: 13,
    name: 'Metal Cabinet',
    category: 'Cabinets',
    image: MetalCabinet1,
  },
];

const categories = ['All', 'Chairs', 'Desks', 'Cabinets', 'Sofas'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalImage, setModalImage] = useState(null);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
    <div className="min-h-screen bg-[#f9fafb] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black-700 mb-6">Product Gallery</h1>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-green-800 border-green-400'
              } hover:bg-yellow-500 transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setModalImage(product)}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold px-4 text-center">
                  {product.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-1 text-sm"
              >
                ✕
              </button>
              <img
                src={modalImage.image}
                alt={modalImage.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-4 text-center text-green-900 font-semibold text-lg">
                {modalImage.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
}
