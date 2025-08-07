import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabase/supabaseClient";

import logo from "../assets/Logo.png";
import heroImage from "../assets/Greencouch.png";
import VisionMission from "../assets/Vision-Mission.jpg";
import BgVision from "../assets/Bg-vision.jpg";
import Footer from "../components/footer";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*").limit(4);
      if (error) console.error("Failed to fetch products:", error);
      else setProducts(data);
    };

    fetchProducts();
  }, []);

  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-0" />

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="container mx-auto flex justify-between items-center">
            <img src={logo} alt="Logo" className="h-14" />
            <nav className="hidden md:flex space-x-6 text-white font-medium">
              <button onClick={() => scrollToSection("home")}>Home</button>
              <Link to="/shop">Products</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/services">Our Services</Link>
            </nav>

            <div className="flex items-center gap-4 text-white">
              <div className="relative">
                <Search
                  onClick={() => setShowSearch(!showSearch)}
                  className="cursor-pointer w-5 h-5 hover:text-yellow-400"
                />
                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="absolute top-8 right-0 w-44 px-2 py-1 text-black bg-white rounded shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                )}
              </div>

              <div className="relative">
                <User
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="cursor-pointer hover:text-yellow-400"
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded shadow z-50">
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  </div>
                )}
              </div>

              <Link to="/cart">
                <ShoppingCart className="cursor-pointer hover:text-yellow-400" />
              </Link>
              <Link to="/contact">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded-lg text-sm font-semibold">
                  Contact
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-16">
          <h1 className="text-5xl font-extrabold text-white max-w-3xl leading-tight mb-4 drop-shadow-lg">
            Transform Your Office Space with Style & Comfort
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mb-6">
            Premium ergonomic furniture designed for health, productivity, and modern aesthetics.
          </p>
          <Link to="/shop">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition-all">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
          {[
            ["Eco-Friendly Materials", "We prioritize sustainable, responsibly sourced materials."],
            ["Ergonomic Comfort", "Furniture designed to support posture and reduce strain."],
            ["Flexible Policies", "Enjoy trial periods, warranties, and hassle-free returns."]
          ].map(([title, desc], idx) => (
            <div key={idx} className="bg-white shadow-xl hover:shadow-2xl transition p-8 rounded-xl border border-gray-200">
              <CheckCircle2 className="text-green-600 mb-4 w-8 h-8 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission Banner */}
      <section className="flex justify-center py-12 bg-cover bg-center" style={{ backgroundImage: `url(${BgVision})` }}>
        <img src={VisionMission} alt="Vision & Mission" className="max-w-5xl rounded-xl shadow-2xl" />
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50" id="products">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="backdrop-blur-md bg-white/60 rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-center">
                <img
                  src={product.image_url || heroImage}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded mb-3"
                />
                <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 max-w-6xl mx-auto">
          {[
            ['"The ergonomic chair changed my life—no more back pain!"', '– Ama K., Accra'],
            ['"Functional and stylish. My office looks amazing now."', '– Kojo M., Kumasi']
          ].map(([quote, author], i) => (
            <div key={i} className="bg-green-50 rounded-xl p-6 shadow hover:shadow-lg transition-all">
              <p className="italic text-gray-800 mb-4">{quote}</p>
              <div className="text-gray-700 font-semibold">{author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup (Updated Section) */}
      <section className="py-16 bg-gradient-to-br from-green-100 via-yellow-100 to-green-200 text-center">
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Stay in the Loop</h2>
        <p className="text-sm text-gray-600 mb-6">Join our newsletter to get exclusive deals and design tips.</p>
        <div className="flex justify-center mt-6">
          <Link to="/newsletter">
            <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-full shadow">
              Subscribe to Newsletter
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
