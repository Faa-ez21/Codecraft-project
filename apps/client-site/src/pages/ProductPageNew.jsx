import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
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
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

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
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Generate product images array (main image + additional images)
  const productImages = product
    ? [product.image_url, ...(product.additional_images || [])].filter(Boolean)
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
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (
            id,
            name,
            slug
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url, price, description")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleQuantityChange = (increase) => {
    if (increase && quantity < (product?.stock_quantity || 0)) {
      setQuantity((prev) => prev + 1);
    } else if (!increase && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock_quantity > 0) {
      addToCart({ ...product, quantity });
      // You could show a toast notification here
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Navbar />
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
        <Navbar />
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
      <Navbar />

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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock_quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.categories?.name && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    (4.8/5 - 124 reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 border-2 border-dashed border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Starting at</p>
                    <p className="text-3xl font-bold text-green-600">
                      GHS{" "}
                      {product.price
                        ? parseFloat(product.price).toLocaleString()
                        : "Contact for Price"}
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

              {/* Quantity & Add to Cart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= (product.stock_quantity || 0)}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                      product.stock_quantity > 0
                        ? "bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock_quantity > 0
                      ? "Add to Inquiry Cart"
                      : "Out of Stock"}
                  </button>

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
                      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                    </button>

                    <button className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 transition-all duration-300 flex items-center justify-center">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Package, text: "Free Assembly" },
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "2 Year Warranty" },
                  { icon: RefreshCw, text: "30 Day Returns" },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200"
                  >
                    <badge.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">
                      {badge.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
          {/* Product Specifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Dimensions", value: '24" W × 26" D × 32-36" H' },
                { label: "Weight Capacity", value: "300 lbs" },
                { label: "Material", value: "Premium Steel & Fabric" },
                { label: "Warranty", value: "2 Years Comprehensive" },
                {
                  label: "Assembly",
                  value: "Professional Installation Available",
                },
                { label: "Certification", value: "ISO 9001 Certified" },
              ].map((spec, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200"
                >
                  <dt className="font-medium text-gray-600 text-sm mb-1">
                    {spec.label}
                  </dt>
                  <dd className="font-semibold text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </div>
          </div>

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
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                      4.8
                    </span>
                    <span className="text-gray-600">out of 5</span>
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
                  rating: 5,
                  date: "2 weeks ago",
                  review:
                    "Exceptional quality and comfort! This chair has completely transformed my work-from-home experience. The lumbar support is perfect and the build quality is outstanding.",
                  verified: true,
                },
                {
                  name: "Mike Chen",
                  rating: 4,
                  date: "1 month ago",
                  review:
                    "Great chair overall. Very comfortable for long hours. Assembly was straightforward and the customer service team was helpful when I had questions.",
                  verified: true,
                },
                {
                  name: "Emily Rodriguez",
                  rating: 5,
                  date: "1 month ago",
                  review:
                    "Worth every penny! The ergonomic design has helped with my back pain issues. Highly recommend for anyone spending long hours at a desk.",
                  verified: true,
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Grid className="w-6 h-6 mr-3 text-green-600" />
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <Link
                    key={index}
                    to={`/product/${relatedProduct.id}`}
                    className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={
                          relatedProduct.image_url || "/api/placeholder/200/200"
                        }
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">
                        GHS{" "}
                        {relatedProduct.price
                          ? parseFloat(relatedProduct.price).toLocaleString()
                          : "N/A"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
