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
  RefreshCw,
  Folder,
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
      <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 border border-gray-100 group-hover:border-green-300 h-full ring-1 ring-gray-100 group-hover:ring-green-200">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-yellow-50/30 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Product Image */}
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-50 to-gray-100">
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

          {/* Quality Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-green-500 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
              Premium Quality
            </span>
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

          {/* Enhanced Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Materials */}
            {product.materials &&
              Array.isArray(product.materials) &&
              product.materials.length > 0 &&
              product.materials.slice(0, 2).map((material, index) => (
                <span
                  key={index}
                  className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-full font-medium shadow-sm border border-green-200"
                >
                  {material}
                </span>
              ))}

            {/* Colors */}
            {product.colors &&
              Array.isArray(product.colors) &&
              product.colors.length > 0 &&
              product.colors.slice(0, 2).map((color, index) => (
                <span
                  key={index}
                  className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-3 py-1.5 rounded-full font-medium shadow-sm border border-yellow-200"
                >
                  {color}
                </span>
              ))}

            {/* Premium Badge if no materials/colors */}
            {(!product.materials || product.materials.length === 0) &&
              (!product.colors || product.colors.length === 0) && (
                <span className="text-xs bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 px-3 py-1.5 rounded-full font-medium shadow-sm border border-green-200">
                  Premium Design
                </span>
              )}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Quality
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-600">Popular</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white rounded-2xl text-sm font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
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
    const groupedSub = subData.reduce((acc, curr) => {
      acc[curr.category_id] = acc[curr.category_id] || [];
      acc[curr.category_id].push(curr);
      return acc;
    }, {});
    setCategories(catData || []);
    setSubcategories(groupedSub);
  };

  const loadFilterOptions = async () => {
    const { data: matData } = await supabase
      .from("products")
      .select("materials");
    const { data: colData } = await supabase.from("products").select("colors");

    // Handle both array (new) and string (legacy) materials
    const allMaterials = (matData || []).flatMap((item) => {
      const materials = [];
      if (item.materials) {
        if (Array.isArray(item.materials)) {
          materials.push(...item.materials);
        } else if (typeof item.materials === "string") {
          // Handle comma-separated string format
          materials.push(...item.materials.split(",").map((m) => m.trim()));
        }
      }
      return materials;
    });

    // Handle both array (new) and string (legacy) colors
    const allColors = (colData || []).flatMap((item) => {
      const colors = [];
      if (item.colors) {
        if (Array.isArray(item.colors)) {
          colors.push(...item.colors);
        } else if (typeof item.colors === "string") {
          // Handle comma-separated string format
          colors.push(...item.colors.split(",").map((c) => c.trim()));
        }
      }
      return colors;
    });

    const uniqueMaterials = [...new Set(allMaterials.filter(Boolean))];
    const uniqueColors = [...new Set(allColors.filter(Boolean))];

    console.log("🎨 Materials found:", uniqueMaterials);
    console.log("🌈 Colors found:", uniqueColors);

    // Fallback data if database has no materials/colors
    const fallbackMaterials = [
      "Wood",
      "Metal",
      "Fabric",
      "Leather",
      "Plastic",
      "Glass",
    ];
    const fallbackColors = [
      "Black",
      "White",
      "Brown",
      "Gray",
      "Blue",
      "Green",
      "Red",
      "Yellow",
    ];

    setMaterials(
      uniqueMaterials.length > 0 ? uniqueMaterials : fallbackMaterials
    );
    setColors(uniqueColors.length > 0 ? uniqueColors : fallbackColors);
  };

  const loadProducts = async (reset = false) => {
    console.log("📦 Loading products...", {
      selectedCategory,
      reset,
      page: reset ? 1 : page,
    });
    setIsLoading(true);

    try {
      let query = supabase.from("products").select(`
          *,
          categories(id, name),
          subcategories(id, name)
        `);

      // Add status filter to only show active products
      query = query.eq("status", "active");

      if (selectedCategory !== "All") {
        const matchedCategory = categories.find(
          (c) => c.name === selectedCategory
        );
        const matchedSub = Object.values(subcategories)
          .flat()
          .find((s) => s.name === selectedCategory);

        console.log("🔍 Category filter:", {
          selectedCategory,
          matchedCategory,
          matchedSub,
        });

        if (matchedCategory) {
          query = query.eq("category_id", matchedCategory.id);
          console.log("✅ Filtering by category_id:", matchedCategory.id);
        } else if (matchedSub) {
          query = query.eq("subcategory_id", matchedSub.id);
          console.log("✅ Filtering by subcategory_id:", matchedSub.id);
        }
      }

      // Handle filtering for array fields
      if (filters.material) {
        query = query.contains("materials", [filters.material]);
      }
      if (filters.color) {
        query = query.contains("colors", [filters.color]);
      }
      if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

      // Add pagination
      const currentPage = reset ? 1 : page;
      query = query.range((currentPage - 1) * 12, currentPage * 12 - 1);

      // Add ordering for consistent results
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error loading products:", error);
        setIsLoading(false);
        return;
      }

      console.log("📦 Products loaded:", data?.length || 0);
      console.log("🔍 Sample product:", data?.[0]);

      if (reset) {
        setProducts(data || []);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...(data || [])]);
        setPage((prev) => prev + 1);
      }
      setHasMore((data || []).length === 12);
    } catch (error) {
      console.error("❌ Error in loadProducts:", error);
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

    // Set up real-time subscription for products
    const productSubscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("🔄 Product change detected:", payload);
          console.log("🔄 Event type:", payload.eventType);
          console.log("🔄 New data:", payload.new);
          console.log("🔄 Old data:", payload.old);
          // Refresh products when changes occur
          setTimeout(() => {
            console.log("⏱️ Refreshing products after 1 second delay...");
            loadProducts(true);
          }, 1000);
        }
      )
      .subscribe();

    // Set up real-time subscription for categories
    const categorySubscription = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        () => {
          console.log("🔄 Category change detected");
          loadCategories();
        }
      )
      .subscribe();

    // Set up real-time subscription for subcategories
    const subcategorySubscription = supabase
      .channel("subcategories-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subcategories",
        },
        () => {
          console.log("🔄 Subcategory change detected");
          loadCategories();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      productSubscription.unsubscribe();
      categorySubscription.unsubscribe();
      subcategorySubscription.unsubscribe();
    };
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

        <div className="flex flex-col lg:flex-row gap-10 flex-1">
          {/* Ultra-Stylish Sidebar */}
          <aside
            className={`w-full lg:w-[320px] relative transition-all duration-500 ${
              showMobileFilters ? "block" : "hidden"
            } lg:block sticky top-8 h-fit`}
          >
            {/* Backdrop with glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-green-50/90 to-yellow-50/85 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl"></div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-yellow-400/10 rounded-3xl"></div>

            {/* Main content */}
            <div className="relative z-10 p-8 text-sm">
              {/* Header with animated icon */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl blur-md opacity-50 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                    Shop Filters
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Find your perfect furniture
                  </p>
                </div>
              </div>

              {/* Enhanced Search with floating label effect */}
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl blur-sm"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-green-200/50 focus:border-green-400 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-xl focus:bg-white/95 placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Ultra-Stylish Categories */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full mr-4"></div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">
                        Categories
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log("🔄 Manual refresh triggered");
                      loadCategories();
                      loadProducts(true);
                      loadFilterOptions();
                    }}
                    className="group p-3 text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                    title="Refresh categories"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  {/* All Products Option - Simplified */}
                  <div
                    onClick={() => {
                      setSelectedCategory("All");
                      setShowMobileFilters(false);
                    }}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-300 ${
                      selectedCategory === "All"
                        ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg"
                        : "bg-white/80 hover:bg-green-50 border border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-3" />
                        <span className="font-semibold">All Products</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Items - Simplified */}
                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <div
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          toggleCategoryExpand(cat.id);
                          setShowMobileFilters(false);
                        }}
                        className={`cursor-pointer rounded-xl p-4 transition-all duration-300 ${
                          selectedCategory === cat.name
                            ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg"
                            : "bg-white/80 hover:bg-green-50 border border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Folder className="w-5 h-5 mr-3" />
                            <div>
                              <span className="font-semibold">{cat.name}</span>
                              <div
                                className={`text-sm ${
                                  selectedCategory === cat.name
                                    ? "text-white/80"
                                    : "text-gray-500"
                                }`}
                              >
                                {subcategories[cat.id]?.length || 0} items
                              </div>
                            </div>
                          </div>
                          {subcategories[cat.id]?.length > 0 && (
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-300 ${
                                expandedCats[cat.id] ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Subcategories - Simplified */}
                      {expandedCats[cat.id] &&
                        subcategories[cat.id]?.length > 0 && (
                          <div className="ml-6 space-y-1 mt-2">
                            {subcategories[cat.id].map((sub) => (
                              <div
                                key={sub.id}
                                onClick={() => {
                                  setSelectedCategory(sub.name);
                                  setShowMobileFilters(false);
                                }}
                                className={`cursor-pointer rounded-lg p-3 transition-all duration-300 ${
                                  selectedCategory === sub.name
                                    ? "bg-green-100 border-l-4 border-green-500 text-green-800"
                                    : "bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-3 ${
                                      selectedCategory === sub.name
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                    }`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {sub.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stylish Enhanced Filters */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-4 font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full mr-3"></div>
                    Material
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl blur-sm"></div>
                    <select
                      className="relative w-full p-4 border-2 border-green-200/50 focus:border-green-400 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-xl hover:bg-white/95 focus:bg-white/95"
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
                </div>

                <div>
                  <label className="block mb-4 font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full mr-3"></div>
                    Color
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl blur-sm"></div>
                    <select
                      className="relative w-full p-4 border-2 border-green-200/50 focus:border-green-400 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:shadow-xl hover:bg-white/95 focus:bg-white/95"
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
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
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
                        setFilters({ material: "", color: "" });
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
                    </span>
                    ///./.
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
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
