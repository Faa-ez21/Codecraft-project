import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
  ShoppingBag,
  Star,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Award,
  Users,
  Package,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { supabase } from "../supabase/supabaseClient";

export default function ProductInquiry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Get state from navigation
  const fromCart = location?.state?.fromCart || false;
  const includeProducts = location?.state?.includeProducts || false;
  const fromService = location?.state?.fromService || false;
  const serviceName = location?.state?.serviceName || "";
  const itemsToShow = location?.state?.cartItems || cartItems || [];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Prepare inquiry data
      const inquiryData = {
        name: form.name.trim(),
        contact: form.email.trim(),
        message: form.message.trim(),
      };

      // Add product information if this is a product inquiry
      if (includeProducts && itemsToShow.length > 0) {
        // For now, just use the first product if multiple items
        inquiryData.product_id = itemsToShow[0].id;

        // Enhance message with product details
        const productNames = itemsToShow.map((item) => item.name).join(", ");
        inquiryData.message += `\n\nProducts of interest: ${productNames}`;
      }

      // Add service information if this is a service inquiry
      if (fromService && serviceName) {
        inquiryData.message = `Service Inquiry: ${serviceName}\n\n${inquiryData.message}`;
      }

      // Submit to Supabase
      const { data, error } = await supabase
        .from("inquiries")
        .insert([inquiryData])
        .select();

      if (error) {
        console.error("Error submitting inquiry:", error);
        setSubmitError("Failed to submit inquiry. Please try again.");
        return;
      }

      console.log("Inquiry submitted successfully:", data);
      setIsSubmitted(true);

      // Reset form after success animation
      setTimeout(() => {
        setForm({ name: "", email: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {fromCart ? "Product Inquiry" : "Get In Touch"}
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {fromService ? (
              <>
                Service{" "}
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  Consultation
                </span>
              </>
            ) : includeProducts ? (
              <>
                Let's Discuss Your{" "}
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  Product Selection
                </span>
              </>
            ) : (
              <>
                Ready to Transform{" "}
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  Your Workspace?
                </span>
              </>
            )}
          </h1>

          <p
            className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {fromService
              ? `Get expert consultation for ${serviceName.toLowerCase()} and receive a customized solution for your business needs.`
              : includeProducts
              ? "Share your requirements and let our experts help you create the perfect office setup."
              : "Connect with our furniture experts for personalized consultations and custom solutions."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information Sidebar */}
          <div
            className={`lg:col-span-1 transition-all duration-700 delay-600 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 sticky top-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                  Get In Touch
                </h3>
                <p className="text-gray-600">
                  We're here to help you create amazing spaces
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Call Us</p>
                    <p className="text-green-600">+233 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-2xl">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Mail className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email Us</p>
                    <p className="text-yellow-600">info@expertoffice.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Visit Us</p>
                    <p className="text-green-600">Accra, Ghana</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-2xl">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Business Hours
                    </p>
                    <p className="text-yellow-600">Mon-Fri: 8AM-6PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl border border-green-100">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="font-bold text-gray-800">Why Choose Us?</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    15+ Years Experience
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-green-500 mr-2" />
                    50K+ Happy Clients
                  </li>
                  <li className="flex items-center">
                    <Package className="w-4 h-4 text-yellow-500 mr-2" />
                    Premium Quality
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-800 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Service Information Display */}
            {fromService && serviceName && (
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent flex items-center">
                  <Award className="w-6 h-6 mr-3 text-green-600" />
                  Service Inquiry
                </h2>
                <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                  <h3 className="font-semibold text-gray-800 text-xl mb-2">
                    {serviceName}
                  </h3>
                  <p className="text-green-600 font-medium">
                    Requesting consultation and quote for this service
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items Display */}
            {includeProducts && itemsToShow.length > 0 && (
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-green-600" />
                  Selected Products
                </h2>
                <div className="grid gap-4">
                  {itemsToShow.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-lg">
                          {item.name}
                        </p>
                        <p className="text-green-600 font-medium">
                          Quantity: {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <Heart className="w-5 h-5 text-red-500 mb-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Form */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8">
              {isSubmitted ? (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Your inquiry has been submitted successfully. We'll get back
                    to you within 24 hours.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => navigate("/shop")}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                      Send Us Your Inquiry
                    </h3>
                    <p className="text-gray-600">
                      Fill out the form below and we'll respond promptly
                    </p>

                    {/* Error Message */}
                    {submitError && (
                      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-700 text-sm">{submitError}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-green-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows="6"
                      required
                      value={form.message}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white resize-none"
                      placeholder={
                        fromCart
                          ? "Share your requirements, specifications, or any questions about the selected items..."
                          : "Tell us about your project, timeline, budget, or any specific requirements..."
                      }
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            Submit Inquiry
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <Link to="/shop" className="flex-1">
                      <button
                        type="button"
                        className="w-full group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-700 rounded-2xl font-semibold hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center">
                          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                          Back to Shop
                        </span>
                      </button>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
