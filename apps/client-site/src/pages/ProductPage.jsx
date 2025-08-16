import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RefreshCw,
  Package,
  Check,
  Sparkles,
  MessageCircle,
  ThumbsUp,
  FileText,
  Grid,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Clock,
} from "lucide-react";
import { supabase } from "../supabase/supabaseClient";
import { useCart } from "../context/CartContext";
import Header from "../components/header";
import Footer from "../components/footer";
import RelatedProducts from "../components/RelatedProducts";
import { trackProductView } from "../utils/userBehaviorTracker";
import {
  debugProducts,
  testRelatedProductsQuery,
} from "../utils/debugProducts";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [productDiscount, setProductDiscount] = useState(null);

  // Helper function to safely parse additional_images
  const parseAdditionalImages = (additional_images) => {
    console.log(
      "Raw additional_images from DB:",
      additional_images,
      typeof additional_images
    );

    if (!additional_images) return [];

    // If it's already an array, validate and clean it
    if (Array.isArray(additional_images)) {
      const cleanImages = additional_images
        .filter((img) => typeof img === "string" && img.trim() !== "")
        .slice(0, 8); // Limit to 8 additional images max
      console.log("Cleaned array images:", cleanImages);
      return cleanImages;
    }

    // If it's a string, try to parse as JSON
    if (typeof additional_images === "string") {
      try {
        const parsed = JSON.parse(additional_images);
        if (Array.isArray(parsed)) {
          const cleanImages = parsed
            .filter((img) => typeof img === "string" && img.trim() !== "")
            .slice(0, 8);
          console.log("Parsed string to array:", cleanImages);
          return cleanImages;
        }
      } catch (e) {
        console.error("Failed to parse additional_images string:", e);
      }
    }

    console.warn("Invalid additional_images format, returning empty array");
    return [];
  };

  // Generate product images array (main image + additional images)
  const productImages = product
    ? [
        product.image_url,
        ...parseAdditionalImages(product.additional_images),
      ].filter(Boolean)
    : [];

  // Generate features from product data
  const features = product
    ? [
        "Premium Quality Materials",
        "Ergonomic Design",
        "Professional Grade",
        "Easy Assembly",
        "Durable Construction",
        "Comfort Optimized",
      ]
    : [];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchProductDiscount();
    }
  }, [product]);

  const fetchProductDiscount = async () => {
    if (!product?.id) return;

    try {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .contains("product_ids", [product.id])
        .eq("status", "Active")
        .gte("end_date", new Date().toISOString())
        .lte("start_date", new Date().toISOString())
        .single();

      if (!error && data) {
        setProductDiscount(data);
      }
    } catch (error) {
      console.log("No active discount found for this product");
      setProductDiscount(null);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log("Fetching product with ID:", id, "Type:", typeof id);

      // Try different ID formats in case of type mismatch
      const queries = [
        // Try as string
        supabase.from("products").select("*").eq("id", id).single(),
        // Try as integer
        supabase.from("products").select("*").eq("id", parseInt(id)).single(),
      ];

      let data, error;
      for (const query of queries) {
        const result = await query;
        if (!result.error) {
          data = result.data;
          error = null;
          break;
        }
        error = result.error;
      }

      console.log("Supabase response:", { data, error });
      console.log(
        "Additional images:",
        data?.additional_images,
        "Length:",
        data?.additional_images?.length
      );

      if (error || !data) {
        // If still not found, let's see what products exist
        const { data: allProducts } = await supabase
          .from("products")
          .select("id, name")
          .limit(5);
        console.log("Available products:", allProducts);
        throw new Error("Product not found");
      }

      setProduct(data);

      // Track product view for recommendations
      trackProductView(data.id, data.category_id);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-300"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header />

      <div className="pt-20">
        {/* Breadcrumb & Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back
              </button>
              <div className="text-sm text-gray-600">
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  to="/shop"
                  className="hover:text-green-600 transition-colors"
                >
                  Shop
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.name}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-green-300 transition-all duration-300 hover:scale-110">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`p-3 rounded-full border transition-all duration-300 hover:scale-110 ${
                  isInWishlist
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-4">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={
                      productImages[selectedImageIndex] ||
                      "/api/placeholder/500/500"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-green-500 ring-2 ring-green-500/30"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.categories?.name && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {product.categories.name}
                    </span>
                  )}
                  {product.subcategories?.name && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {product.subcategories.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                  {product.name}
                </h1>

                {/* Discount Widget */}
                {productDiscount && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg border-2 border-red-300 relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/20 rounded-full p-2 mr-3">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                                LIMITED OFFER
                              </span>
                              <span className="text-white text-sm font-medium">
                                {productDiscount.name}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {productDiscount.discount_type === "percentage"
                                ? `${productDiscount.discount_value}% OFF`
                                : `$${productDiscount.discount_value} OFF`}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-white/80 text-xs mb-1">
                            Code:
                          </div>
                          <div className="bg-white/20 text-white font-mono font-bold px-3 py-1 rounded-lg text-sm">
                            {productDiscount.code}
                          </div>
                          <div className="text-white/80 text-xs mt-1">
                            Valid until{" "}
                            {new Date(
                              productDiscount.end_date
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Assurance */}
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 border-2 border-dashed border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Premium Quality
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      Expert Crafted
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-600 mb-1">
                      <Award className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Best Value</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Free installation included
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description ||
                    "This premium office furniture piece combines style, comfort, and functionality to create the perfect addition to your workspace."}
                </p>
              </div>

              {/* Key Features */}
              {features.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-6 border-2 border-dashed border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shopping Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Add to Cart
                </h3>

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Availability:</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      addToCart({ ...product, quantity });
                      // Show success feedback
                      const button = document.querySelector("#add-to-cart-btn");
                      const originalText = button.innerHTML;
                      button.innerHTML =
                        '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Added to Cart!';
                      setTimeout(() => {
                        button.innerHTML = originalText;
                      }, 2000);
                    }}
                    id="add-to-cart-btn"
                    className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>

                  <Link
                    to="/inquiry"
                    className="w-full py-3 rounded-xl font-medium text-green-600 border-2 border-green-200 hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Request Custom Quote
                  </Link>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsInWishlist(!isInWishlist)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                        isInWishlist
                          ? "border-red-300 bg-red-50 text-red-600"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${
                          isInWishlist ? "fill-current" : ""
                        }`}
                      />
                      {isInWishlist ? "Saved" : "Save"}
                    </button>

                    <button className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 transition-all duration-300 flex items-center justify-center">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges & Benefits */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Why Choose Expert Office Furnish?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Package,
                      text: "Free Assembly",
                      desc: "Professional setup included",
                    },
                    {
                      icon: Truck,
                      text: "Free Delivery",
                      desc: "Same-day delivery available",
                    },
                    {
                      icon: Shield,
                      text: "2 Year Warranty",
                      desc: "Comprehensive coverage",
                    },
                    {
                      icon: RefreshCw,
                      text: "30 Day Returns",
                      desc: "No questions asked",
                    },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-300"
                    >
                      <badge.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {badge.text}
                      </p>
                      <p className="text-xs text-gray-600">{badge.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Additional Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        24/7 Customer Support
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        ISO 9001 Certified
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        Fast Track Service
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
          {/* Customer Reviews */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-3 text-green-600" />
              Customer Reviews
            </h2>

            {/* Overall Rating */}
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-dashed border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-green-600">
                      Excellent
                    </span>
                    <span className="text-gray-600">Quality Rating</span>
                  </div>
                  <p className="text-gray-600">Based on 124 verified reviews</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    97% would recommend
                  </p>
                  <div className="flex items-center text-green-600">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">Highly Rated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {[
                {
                  name: "Sarah Johnson",
                  date: "2 weeks ago",
                  review:
                    "Exceptional quality and comfort! This chair has completely transformed my work-from-home experience. The lumbar support is perfect and the build quality is outstanding.",
                  verified: true,
                  recommendation: "Highly Recommended",
                },
                {
                  name: "Mike Chen",
                  date: "1 month ago",
                  review:
                    "Great chair overall. Very comfortable for long hours. Assembly was straightforward and the customer service team was helpful when I had questions.",
                  verified: true,
                  recommendation: "Recommended",
                },
                {
                  name: "Emily Rodriguez",
                  date: "1 month ago",
                  review:
                    "Worth every penny! The ergonomic design has helped with my back pain issues. Highly recommend for anyone spending long hours at a desk.",
                  verified: true,
                  recommendation: "Highly Recommended",
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            review.recommendation === "Highly Recommended"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {review.recommendation}
                        </span>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products - Enhanced */}
          <RelatedProducts
            currentProductId={product?.id}
            currentCategoryId={product?.category_id}
            algorithm="category"
            title="Related Products"
            subtitle="Customers who viewed this item also viewed"
            limit={4}
            showAddToCart={true}
          />

          {/* Popular Products */}
          <RelatedProducts
            algorithm="popular"
            title="Popular This Week"
            subtitle="Most viewed office furniture this week"
            limit={4}
            showAddToCart={true}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
