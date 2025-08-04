import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { useCart } from '../context/CartContext';
import { supabase } from "../supabase/supabaseClient";
import debounce from 'lodash.debounce';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;
      setUser(currentUser);
      setEmailConfirmed(currentUser?.email_confirmed_at !== null);
      setRole(currentUser?.user_metadata?.role || 'Customer');
    };
    getUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  // Debounced global search (products & blogs)
  const handleSearch = debounce(async (term) => {
    if (!term.trim()) return setSearchResults([]);
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .ilike('name', `%${term}%`);

    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title')
      .ilike('title', `%${term}%`);

    setSearchResults([
      ...products.map(p => ({ id: p.id, label: p.name, type: 'product' })),
      ...blogs.map(b => ({ id: b.id, label: b.title, type: 'blog' })),
    ]);
  }, 400);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return (
    <header className="p-4 sm:p-6 bg-gray-800 text-white shadow-md z-50 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/"><img src={logo} alt="Expert Office Logo" className="h-16 sm:h-20" /></Link>

        {/* Navigation */}
        <nav className="space-x-4 hidden sm:block">
          <Link to="/home" className="hover:text-green-400">Home</Link>
          <Link to="/shop" className="hover:text-green-400">Products</Link>
          <Link to="/gallery" className="hover:text-green-400">Gallery</Link>
          <Link to="/services" className="hover:text-green-400">Our Services</Link>
        </nav>

        {/* Right-side icons */}
        <div className="flex items-center gap-4 relative">
          {/* Search */}
          <div className="relative">
            <Search 
              className="cursor-pointer w-5 h-5" 
              onClick={() => setShowSearch(!showSearch)} 
            />
            {showSearch && (
              <div className="absolute top-8 right-0 w-60 bg-white text-black p-2 rounded shadow">
                <input
                  type="text"
                  placeholder="Search products or blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                />
                {searchResults.length > 0 && (
                  <ul className="mt-2 text-xs max-h-40 overflow-y-auto">
                    {searchResults.map((result) => (
                      <li
                        key={`${result.type}-${result.id}`}
                        onClick={() => {
                          navigate(`/${result.type}/${result.id}`);
                          setSearchTerm('');
                          setShowSearch(false);
                        }}
                        className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {result.label} <span className="text-gray-500">({result.type})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 text-[10px] bg-green-500 text-white rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User */}
          <div className="relative">
            <User className="cursor-pointer w-5 h-5" onClick={() => setShowDropdown(!showDropdown)} />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-md z-50 text-sm">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b text-gray-700 flex flex-col">
                      <span className="flex items-center gap-1">
                        {user.email}
                        {emailConfirmed && <CheckCircle2 className="text-green-500" size={14} />}
                      </span>
                      <span className="text-[11px] text-gray-500">{role}</span>
                    </div>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate(role === 'Admin' ? '/dashboard' : '/profile');
                      }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Contact button */}
          <Link to="/contact">
            <button className="bg-white text-green-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-200">
              Contact
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
