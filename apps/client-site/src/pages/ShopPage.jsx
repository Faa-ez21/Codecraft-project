import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  Filter,
  ShoppingCart,
  Sparkles,
  Grid,
  List,
  ArrowRight,
  Heart,
  Eye,
  Package,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabase/supabaseClient";
import Sofa from "../assets/sofa.png";
import Cabinet from "../assets/cabinet.jpg";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group cursor-pointer transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 border border-gray-100 group-hover:border-green-200 h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-green-50 to-yellow-50">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-100 animate-pulse flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay Actions */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>

            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-110">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-4 right-4">
            {product.stock_quantity > 0 ? (
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                In Stock
              </span>
            ) : (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-4 left-4">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 text-xl mb-3 line-clamp-2">
              {product.name}
            </h3>

            {/* Category Tag */}
            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-yellow-100 text-green-700 rounded-full text-xs font-medium">
              <Package className="w-3 h-3 mr-1" />
              {product.categories?.name ||
                product.subcategories?.name ||
                "Office Furniture"}
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.material && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                {product.material}
              </span>
            )}
            {product.color && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                {product.color}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Stock: {product.stock_quantity || 0}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg transform transition-all duration-300 flex items-center ${
                product.stock_quantity > 0
                  ? "bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white hover:scale-105 hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Sparkles className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </Link>
  );
};

const ShopPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState({
    material: "",
    color: "",
    inStock: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const observer = useRef();

  const loadCategories = async () => {
    const { data: catData } = await supabase.from("categories").select("*");
    const { data: subData } = await supabase.from("subcategories").select("*");
    const groupedSub = subData?.reduce((acc, curr) => {
      acc[curr.category_id] = acc[curr.category_id] || [];
      acc[curr.category_id].push(curr);
      return acc;
    }, {});
        const allCategories = [...(catData || []), ...extraCategories];
        extraCategories.forEach((cat) => {
      if (cat.subcategories?.length > 0) {
        groupedSub[cat.id] = (groupedSub[cat.id] || []).concat(
          cat.subcategories.map((name, idx) => ({
            id: `${cat.id}-${idx}`, // fake id so React can key it
            name,
            category_id: cat.id,
          }))
        );
      }
    });

    setCategories(allCategories);
    setSubcategories(groupedSub);
  };
  // Example hardcoded categories
  const extraCategories = [
    { id: "1", name: "Cabinets" ,image: Cabinet, subcategories: ["Wooden Cabinets", "Metal Cabinets"]},
    { id: "2", name: "Sofas", image: Sofa, subcategories: [] },
  ];

  const loadSubcategories = async () => {
    const { data: subData } = await supabase.from("subcategories").select("*");
    const groupedSub = subData.reduce((acc, curr) => {
      acc[curr.category_id] = acc[curr.category_id] || [];
      acc[curr.category_id].push(curr);
      return acc;
    }, {});
    setCategories([...(catData || []), ...extraCategories]);
    setSubcategories(groupedSub);
  };

  const loadFilterOptions = async () => {
    const { data: matData } = await supabase
      .from("products")
      .select("materials");
    const { data: colData } = await supabase.from("products").select("colors");
    setMaterials([...new Set(matData.flatMap((item) => item.materials || []))]);
    setColors([...new Set(colData.flatMap((item) => item.colors || []))]);
  };

  const loadProducts = async (reset = false) => {
    setIsLoading(true);
    let query = supabase.from("products").select(`
        *,
        categories(name),
        subcategories(name)
      `);

    if (selectedCategory !== "All") {
      const matchedCategory = categories.find(
        (c) => c.name === selectedCategory
      );
      const matchedSub = Object.values(subcategories)
        .flat()
        .find((s) => s.name === selectedCategory);
      if (matchedCategory) query = query.eq("category_id", matchedCategory.id);
      else if (matchedSub) query = query.eq("subcategory_id", matchedSub.id);
    }

    if (filters.material)
      query = query.contains("materials", [filters.material]);
    if (filters.color) query = query.contains("colors", [filters.color]);
    if (filters.inStock) query = query.gt("stock_quantity", 0);
    if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

    query = query.range((page - 1) * 12, page * 12 - 1);

    const { data, error } = await query;
    if (!error) {
      if (reset) {
        setProducts(data);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
      setHasMore(data.length === 12);
    }

    // Add delay for smooth loading animation
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, selectedCategory, filters, searchTerm]
  );

  useEffect(() => {
    loadCategories();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [selectedCategory, filters, searchTerm]);

  const toggleCategoryExpand = (catId) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleGetConsultation = () => {
    navigate("/inquiry");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 text-gray-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-yellow-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 animate-fadeInDown">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Office Collection
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fadeInUp">
            Discover Your Perfect{" "}
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Office Furniture
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            Transform your workspace with our curated collection of premium
            office furniture, designed for modern professionals who value style,
            comfort, and productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fadeInUp animation-delay-400">
            <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Browse Collection
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleGetConsultation}
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-700 rounded-2xl font-semibold hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Get Consultation
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">50K+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-green-200/50 rounded-full animate-spin"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-yellow-200/50 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </section>

      <div className="flex flex-col lg:flex-row px-4 md:px-10 py-12 gap-10 flex-1 relative z-10">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center w-full bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-300"
          >
            <Filter className="w-5 h-5 mr-2 text-green-600" />
            <span className="font-medium">Filters & Categories</span>
            <ChevronDown
              className={`w-5 h-5 ml-2 transition-transform ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Enhanced Sidebar */}
        <aside
          className={`w-full lg:w-[300px] bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 text-sm transition-all duration-500 ${
            showMobileFilters ? "block" : "hidden"
          } lg:block sticky top-8 h-fit`}
        >
          <div className="flex items-center mb-8">
            <div className="p-2 bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl mr-3">
              <Filter className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Shop Filters
            </h2>
          </div>

          {/* Enhanced Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-green-400 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-lg focus:bg-white/90"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h3 className="font-semibold mb-6 text-gray-700 flex items-center text-lg">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mr-3"></div>
              Categories
            </h3>
            <ul className="space-y-3">
              <li
                onClick={() => {
                  setSelectedCategory("All");
                  setShowMobileFilters(false);
                }}
                className={`cursor-pointer px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  selectedCategory === "All"
                    ? "font-bold text-white bg-gradient-to-r from-green-500 to-yellow-500 shadow-2xl scale-105"
                    : "text-gray-700 hover:text-green-700 bg-white/60 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  All Products
                  {selectedCategory === "All" && (
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  )}
                </div>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <div
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      toggleCategoryExpand(cat.id);
                      setShowMobileFilters(false);
                    }}
                    className={`flex items-center justify-between cursor-pointer px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      selectedCategory === cat.name
                        ? "font-bold text-white bg-gradient-to-r from-green-500 to-yellow-500 shadow-2xl scale-105"
                        : "text-gray-700 hover:text-green-700 bg-white/60 hover:bg-white/80"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <div className="flex items-center">
                      {selectedCategory === cat.name && (
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      )}
                      {subcategories[cat.id]?.length > 0 &&
                        (expandedCats[cat.id] ? (
                          <ChevronUp
                            size={16}
                            className="transform rotate-180 transition-transform duration-300"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="transition-transform duration-300"
                          />
                        ))}
                    </div>
                  </div>
                  {expandedCats[cat.id] &&
                    subcategories[cat.id]?.length > 0 && (
                      <ul className="pl-6 mt-3 space-y-2 text-sm">
                        {subcategories[cat.id].map((sub) => (
                          <li
                            key={sub.id}
                            onClick={() => {
                              setSelectedCategory(sub.name);
                              setShowMobileFilters(false);
                            }}
                            className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
                              selectedCategory === sub.name
                                ? "text-green-700 font-semibold bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200"
                                : "text-gray-600 hover:text-green-700 bg-white/50 hover:bg-white/70"
                            }`}
                          >
                            {sub.name}
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Filters */}
          <div className="space-y-8">
            <div>
              <label className="block mb-4 text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mr-3"></div>
                Material
              </label>
              <select
                className="w-full p-4 border-2 border-gray-200 focus:border-green-400 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-lg hover:bg-white/90"
                value={filters.material}
                onChange={(e) =>
                  setFilters({ ...filters, material: e.target.value })
                }
              >
                <option value="">All Materials</option>
                {materials.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-4 text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mr-3"></div>
                Color
              </label>
              <select
                className="w-full p-4 border-2 border-gray-200 focus:border-green-400 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-lg hover:bg-white/90"
                value={filters.color}
                onChange={(e) =>
                  setFilters({ ...filters, color: e.target.value })
                }
              >
                <option value="">All Colors</option>
                {colors.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <input
                type="checkbox"
                id="stock"
                checked={filters.inStock}
                onChange={(e) =>
                  setFilters({ ...filters, inStock: e.target.checked })
                }
                className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label
                htmlFor="stock"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Only show in-stock items
              </label>
            </div>
          </div>
        </aside>

        {/* Enhanced Product Grid */}
        <main className="flex-1">
          {/* Enhanced Header with View Mode Toggle */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-3 capitalize bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  {selectedCategory}
                </h2>
                <p className="text-gray-600 text-lg">
                  {products.length > 0
                    ? `Showing ${products.length} products in our premium collection`
                    : "Explore our quality office furniture collection"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-green-600 hover:bg-white"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-green-600 hover:bg-white"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <section>
            {isLoading && products.length === 0 ? (
              // Loading Skeletons
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(12)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 shadow-lg animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map((item, index) =>
                  index === products.length - 1 ? (
                    <div ref={lastProductRef} key={item.id}>
                      <ProductCard product={item} index={index} />
                    </div>
                  ) : (
                    <ProductCard key={item.id} product={item} index={index} />
                  )
                )}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-200 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any products matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setFilters({ material: "", color: "", inStock: false });
                    }}
                    className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Loading More Indicator */}
            {isLoading && products.length > 0 && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-3"></div>
                  <span className="text-gray-600 font-medium">
                    Loading more products...
                  </span>///./.
                </div>
              </div>
            )}

            {/* End Message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-8 border-2 border-dashed border-green-300">
                  <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    You've seen it all! 🎉
                  </p>
                  <p className="text-gray-600">
                    You've reached the end of our amazing collection.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
