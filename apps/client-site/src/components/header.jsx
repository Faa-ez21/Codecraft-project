import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabase/supabaseClient";
import debounce from "lodash.debounce";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;
      setUser(currentUser);
      setEmailConfirmed(currentUser?.email_confirmed_at !== null);
      setRole(currentUser?.user_metadata?.role || "Customer");
    };
    getUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  // Debounced global search (products & blogs)
  const handleSearch = debounce(async (term) => {
    if (!term.trim()) return setSearchResults([]);
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .ilike("name", `%${term}%`);

    const { data: blogs } = await supabase
      .from("blogs")
      .select("id, title")
      .ilike("title", `%${term}%`);

    setSearchResults([
      ...products.map((p) => ({ id: p.id, label: p.name, type: "product" })),
      ...blogs.map((b) => ({ id: b.id, label: b.title, type: "blog" })),
    ]);
  }, 400);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-green-100"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img
                src={logo}
                alt="Expert Office Logo"
                className="h-10 sm:h-12 transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/10 to-yellow-400/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/home"
              className={`relative font-medium text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600"
                  : "text-white hover:text-yellow-200"
              }`}
            >
              Home
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/shop"
              className={`relative font-medium text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600"
                  : "text-white hover:text-yellow-200"
              }`}
            >
              Products
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/gallery"
              className={`relative font-medium text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600"
                  : "text-white hover:text-yellow-200"
              }`}
            >
              Gallery
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/services"
              className={`relative font-medium text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600"
                  : "text-white hover:text-yellow-200"
              }`}
            >
              Our Services
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Enhanced Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {showSearch && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg text-gray-800 p-4 rounded-2xl shadow-2xl border border-green-100 animate-fadeIn">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products or blogs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 text-sm border border-green-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                    />
                    <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-3 max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          onClick={() => {
                            navigate(`/${result.type}/${result.id}`);
                            setSearchTerm("");
                            setShowSearch(false);
                          }}
                          className="flex items-center justify-between p-3 hover:bg-green-50 cursor-pointer rounded-xl transition-all duration-300 group"
                        >
                          <span className="text-gray-700 group-hover:text-green-600 font-medium">
                            {result.label}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            {result.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Cart */}
            <Link to="/cart" className="relative group">
              <div
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </Link>

            {/* Enhanced User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg text-gray-800 rounded-2xl shadow-2xl border border-green-100 overflow-hidden animate-fadeIn">
                  {user ? (
                    <>
                      <div className="px-4 py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {user.email}
                          </span>
                          {emailConfirmed && (
                            <CheckCircle2
                              className="text-green-500"
                              size={16}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-gray-600 font-medium">
                            {role}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate(
                            role === "Admin" ? "/dashboard" : "/profile"
                          );
                        }}
                      >
                        <User size={16} className="text-green-600" />
                        <span className="text-gray-700 font-medium">
                          Profile
                        </span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={16} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-gray-700 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-gray-700 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Contact button */}
            <Link to="/contact">
              <button
                className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white hover:from-green-600 hover:to-yellow-600"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                <span className="hidden sm:inline">Contact</span>
                <span className="sm:hidden">Call</span>
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`lg:hidden p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isScrolled
                  ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-green-100 animate-slideDown">
            <div className="py-4 space-y-2">
              <Link
                to="/home"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link
                to="/gallery"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Gallery
              </Link>
              <Link
                to="/services"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Our Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
