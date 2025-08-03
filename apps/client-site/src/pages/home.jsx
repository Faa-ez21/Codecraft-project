import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Search, ShoppingCart, User } from 'lucide-react';
import heroImage from '../assets/Greencouch.png';
import logo from '../assets/Logo.png';
import Footer from '../components/footer';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported
import Sofa  from '../assets/sofa.png';
import Desk from '../assets/Executivedesk.jpg';
import Swivel from '../assets/Swivel.jpg';
import Cabinet from '../assets/Cabinet.jpg';
import { useState } from 'react';
import VisionMission from '../assets/Vision-Mission.jpg';



export default function Homepage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <div className="bg-white text-gray-800">
      {/* Hero with Header Combined */}
      <section className="relative h-screen bg-green-100 text-white" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="relative z-10 h-full flex flex-col">
          <header className="p-6 bg-transparent z-50">
            <div className="container mx-auto flex justify-between items-center">
              <img src={logo} alt="Expert Office Logo" className="h-20" />
              <nav className="space-x-4 text-white hidden sm:block">
                <button onClick={() => scrollToSection('home')} className="hover:underline">Home</button>
               <Link to="/shop">
                <button onClick={() => scrollToSection('products')} className="hover:underline">Products</button>
                </Link>
                <Link to="/gallery">
                <button onClick={() => scrollToSection('gallery')} className="hover:underline"> Gallery</button>
                </Link>
                <Link to="/services">
                  <button onClick={() => scrollToSection('ourservices')} className="hover:underline">Our Services</button>
                </Link>
              </nav>
              <div className="flex items-center gap-4 text-white">
                 {/* Search Icon */}
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
                <div className="relative">
                            <User className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
                            {showDropdown && (
                              <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-lg shadow-md">
                                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                                <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                              </div>
                            )}
                          </div>
                <Link to="/cart">
                  <ShoppingCart className="cursor-pointer" />
                </Link>
                <Link to={"/contact"}>
                  <button onClick={() => scrollToSection('contact')} className="bg-white text-green-800 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-200">Contact</button>
                </Link>
              </div>
            </div>
          </header>
          <div id="home" className="flex-grow flex flex-col justify-center items-start text-left px-4 sm:px-16 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Elevate Your Workspace</h1>
            <p className="text-lg max-w-2xl mb-6">Discover premium office furniture designed with purpose. Solutions tailored for your health and productivity.</p>
             <Link to="/shop">
             <button className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800">Shop Now</button>
            </Link>
          </div>

        </div>
      </section>
       

      {/* Commitments */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">Your Health Your Wealth</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <CheckCircle2 className="text-yellow-600 mb-3 w-6 h-6 mx-auto" />
            <h3 className="font-semibold mb-2">Eco-Friendly Materials</h3>
            <p>We prioritize sustainable, responsibly sourced materials.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <CheckCircle2 className="text-yellow-600 mb-3 w-6 h-6 mx-auto" />
            <h3 className="font-semibold mb-2">Ergonomic Comfort</h3>
            <p>Furniture designed to support posture and reduce strain.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <CheckCircle2 className="text-yellow-600 mb-3 w-6 h-6 mx-auto" />
            <h3 className="font-semibold mb-2">Free Trials & Policies</h3>
            <p>Enjoy trial periods, warranties, and easy returns.</p>
          </div>
        </div>
      </section>
      {/* 🔽 Vision & Mission Image Section */}
      <section className="flex justify-center items-center py-12 bg-white">
        <img 
          src={VisionMission} 
          alt="Our Vision and Mission" 
          className="max-w-full md:max-w-3xl rounded-xl shadow-lg"
        />
      </section>

      {/* Products */}
      <section id="products" className="py-16 bg-green-50">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-4">
            <img src={Sofa} alt="Sofa" className="w-full h-40 object-cover rounded-xl mb-2" />
            <h4 className="font-medium">Sofa</h4>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <img src={Desk} alt="Desk" className="w-full h-40 object-cover rounded-xl mb-2" />
            <h4 className="font-medium">Executive Desk</h4>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <img src={Swivel} alt="Ergonomic Swivel Chairs" className="w-full h-40 object-cover rounded-xl mb-2" />
            <h4 className="font-medium">Ergonomic Swivel Chair</h4>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <img src={Cabinet} alt="Cabinet" className="w-full h-40 object-cover rounded-xl mb-2" />
            <h4 className="font-medium">Modern Cabinet</h4>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">What Our Customers Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div className="bg-green-50 p-6 rounded-xl shadow">
            <p className="italic mb-4">"The ergonomic chair changed my work-from-home life! No more back pain. Highly recommend Expert Office."</p>
            <div className="font-semibold">– Ama K., Accra</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow">
            <p className="italic mb-4">"Beautiful, functional designs that actually help me stay focused and feel better throughout the day."</p>
            <div className="font-semibold">– Kojo M., Kumasi</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 px-4 bg-white text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
      <p className="text-sm text-gray-600 mb-6">
        Sign up for our newsletter to receive exclusive offers and the latest news on our products.
      </p>

      <form className="flex justify-center">
        <div className="bg-gray-100 p-2 rounded-full flex items-center w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow bg-transparent px-4 py-2 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-300 hover:bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Subscribe
          </button>
        </div>
      </form>
    </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported