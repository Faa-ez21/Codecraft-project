import logo from '../assets/Logo.png';
import React from 'react';
import { CheckCircle2, Search, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';




export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="p-6 bg-gray-800 z-50 relative">
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="Expert Office Logo" className="h-20" />
        
        {/* Navigation */}
        <nav className="space-x-4 text-white hidden sm:block">
          <Link to="/home"><button className="hover:underline">Home</button></Link>
          <Link to="/shop"><button className="hover:underline">Products</button></Link>
          <Link to="/gallery"><button className="hover:underline">Gallery</button></Link>
          <Link to="/services"><button className="hover:underline">Our Services</button></Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-white relative">
          <div className="relative">
        <Search 
          className="cursor-pointer w-5 h-5" 
          onClick={() => setShowSearch(!showSearch)} 
        />
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="absolute top-8 right-0 w-40 p-2 text-black bg-white rounded shadow focus:outline-none focus:ring"
          />
        )}
      </div>
          
          {/* User icon with dropdown */}
          <div className="relative">
            <User className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-lg shadow-md">
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
              </div>
            )}
          </div>

          <Link to="/cart"><ShoppingCart className="cursor-pointer" /></Link>
          
          <Link to="/contact">
            <button className="bg-white text-green-800 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-200">
              Contact
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
