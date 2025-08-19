import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Star,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingUp,
  Users,
  Award,
  Heart,
  Zap,
  Gift,
  Clock,
  Shield,
  Truck,
  Phone,
  Mail,
  X,
  Play,
  MessageCircle,
  ThumbsUp,
  Eye,
  Download,
  Bell,
  Lightbulb,
} from "lucide-react";
import { supabase } from "../supabase/supabaseClient";

import heroImage from "../assets/hero.jpg";
import VisionMission from "../assets/Vision-Mission.jpg";
import BgVision from "../assets/Bg-vision.jpg";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlogLoading, setIsBlogLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // New state for enhanced features
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    reviews: 0,
    yearsExperience: 0,
  });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSmartPopup, setShowSmartPopup] = useState(false);
  const [userInteractions, setUserInteractions] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Refs for intersection observer
  const heroRef = useRef(null);
  const commitmentRef = useRef(null);
  const productsRef = useRef(null);
  const blogRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);

  // Animation states
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    commitments: false,
    products: false,
    blog: false,
    testimonials: false,
    stats: false,
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Enhanced scroll tracking and smart popup logic
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Track user engagement for smart newsletter popup
      if (
        window.scrollY > 1000 &&
        userInteractions > 3 &&
        timeOnPage > 30 &&
        !showSmartPopup
      ) {
        setTimeout(() => setShowSmartPopup(true), 2000);
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleUserInteraction = () => {
      setUserInteractions((prev) => prev + 1);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    // Time on page tracker
    const timer = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      clearInterval(timer);
    };
  }, [userInteractions, timeOnPage, showSmartPopup]);

  // Auto-rotating testimonials
  useEffect(() => {
    const testimonials = [
      {
        id: 1,
        name: "Sarah Johnson",
        position: "CEO at TechStart",
        content:
          "Expert Office Furnish transformed our workspace completely. The ergonomic chairs have significantly improved our team's productivity and comfort.",
        rating: 5,
        image: "/api/placeholder/64/64",
      },
      {
        id: 2,
        name: "Michael Chen",
        position: "Operations Manager",
        content:
          "Outstanding quality and service! The delivery was prompt and the installation team was professional. Highly recommend for any office setup.",
        rating: 5,
        image: "/api/placeholder/64/64",
      },
      {
        id: 3,
        name: "Emma Davis",
        position: "Creative Director",
        content:
          "Beautiful designs that perfectly match our brand aesthetic. The furniture is not only stylish but incredibly functional for our creative team.",
        rating: 5,
        image: "/api/placeholder/64/64",
      },
    ];

    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialTimer);
  }, []);

  // Animate stats counter
  useEffect(() => {
    if (visibleSections.stats) {
      const targetStats = {
        customers: 1250,
        products: 500,
        reviews: 4.9,
        yearsExperience: 15,
      };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          customers: Math.floor(targetStats.customers * progress),
          products: Math.floor(targetStats.products * progress),
          reviews: parseFloat((targetStats.reviews * progress).toFixed(1)),
          yearsExperience: Math.floor(targetStats.yearsExperience * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, stepTime);
    }
  }, [visibleSections.stats]);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute("data-section");
          setVisibleSections((prev) => ({ ...prev, [sectionName]: true }));
        }
      });
    }, observerOptions);

    const sections = [
      heroRef,
      commitmentRef,
      productsRef,
      blogRef,
      testimonialsRef,
      statsRef,
    ];
    sections.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Data structures for enhanced content
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO at TechStart",
      content:
        "Expert Office Furnish transformed our workspace completely. The ergonomic chairs have significantly improved our team's productivity and comfort.",
      rating: 5,
      image: "/api/placeholder/64/64",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Operations Manager",
      content:
        "Outstanding quality and service! The delivery was prompt and the installation team was professional. Highly recommend for any office setup.",
      rating: 5,
      image: "/api/placeholder/64/64",
    },
    {
      id: 3,
      name: "Emma Davis",
      position: "Creative Director",
      content:
        "Beautiful designs that perfectly match our brand aesthetic. The furniture is not only stylish but incredibly functional for our creative team.",
      rating: 5,
      image: "/api/placeholder/64/64",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Delivery",
      description:
        "Get your furniture delivered within 24-48 hours in major cities",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Lifetime Warranty",
      description:
        "Comprehensive warranty coverage on all premium furniture pieces",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award-Winning Design",
      description:
        "Internationally recognized designs that win industry awards",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer Love",
      description:
        "99% customer satisfaction rate with thousands of happy clients",
      color: "from-pink-500 to-red-500",
    },
  ];

  // Newsletter subscription handler
  const handleNewsletterSubscribe = async (email, source = "modal") => {
    try {
      // Smart newsletter logic - different benefits based on source
      const benefits =
        source === "popup"
          ? { discount: 15, freeShipping: true, earlyAccess: true }
          : { discount: 10, freeShipping: true };

      console.log("Newsletter subscription:", { email, source, benefits });
      // Here you would typically send to your backend/email service

      setNewsletterEmail("");
      setShowNewsletterModal(false);
      setShowSmartPopup(false);

      // Show success message (you can replace with toast)
      alert(
        `🎉 Welcome! Check your email for a ${benefits.discount}% discount code!`
      );
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(4);
        if (error) console.error("Failed to fetch products:", error);
        else setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    const fetchBlogPosts = async () => {
      setIsBlogLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            `
            id,
            title,
            excerpt,
            content,
            created_at,
            image_url,
            tags,
            users!blog_posts_author_id_fkey(name, email)
          `
          )
          .eq("status", "Published")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Failed to fetch blog posts:", error);
          setBlogPosts([
            {
              id: 1,
              title: "Creating the Perfect Ergonomic Office Setup",
              excerpt:
                "Discover how to design a workspace that promotes health, productivity, and comfort with our expert tips.",
              created_at: "2024-08-01",
              image_url: null,
            },
            {
              id: 2,
              title: "2024 Office Design Trends: Green & Sustainable",
              excerpt:
                "Explore the latest trends in eco-friendly office furniture and sustainable workplace design.",
              created_at: "2024-07-28",
              image_url: null,
            },
            {
              id: 3,
              title: "Maximizing Small Office Spaces",
              excerpt:
                "Smart furniture solutions and layout ideas to make the most of compact work environments.",
              created_at: "2024-07-20",
              image_url: null,
            },
          ]);
        } else {
          setBlogPosts(data || []);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setTimeout(() => setIsBlogLoading(false), 800);
      }
    };

    fetchProducts();
    fetchBlogPosts();
  }, []);

  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="bg-white text-gray-900 overflow-hidden relative">
      {/* Header Component */}
      <Header />

      {/* Floating Interactive Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg animate-pulse opacity-70"
          style={{
            left: `${Math.sin(scrollY * 0.001) * 100 + 100}px`,
            top: `${Math.cos(scrollY * 0.001) * 50 + 200}px`,
          }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg animate-bounce opacity-50"
          style={{
            right: `${Math.sin(scrollY * 0.002) * 80 + 150}px`,
            top: `${Math.cos(scrollY * 0.002) * 60 + 300}px`,
          }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-60"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05 + 100}px`,
          }}
        ></div>
      </div>

      {/* Smart Newsletter Popup */}
      {showSmartPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Wait! Don't Miss Out! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                You've been browsing for a while! Get <strong>15% OFF</strong>{" "}
                your first order + free shipping + early access to new
                collections!
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email for exclusive deals"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <button
                  onClick={() =>
                    handleNewsletterSubscribe(newsletterEmail, "popup")
                  }
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Claim My 15% Discount
                </button>
                <button
                  onClick={() => setShowSmartPopup(false)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  No thanks, I'll pay full price
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSmartPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        data-section="hero"
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-green-900/50 to-black/80 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-16">
          <div
            className={`transform transition-all duration-1000 ${
              visibleSections.hero
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Announcement Banner */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full mb-8 backdrop-blur-sm border border-yellow-500/50 shadow-lg">
              <Zap className="w-5 h-5 text-yellow-400 mr-3 animate-pulse" />
              <span className="text-white font-medium">
                🔥 Limited Time: Free Delivery on Orders Above $500!
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold text-white max-w-5xl leading-tight mb-8 drop-shadow-2xl">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 animate-pulse">
                Workspace
              </span>
              Into Excellence
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-10 leading-relaxed">
              Premium ergonomic furniture designed for health, productivity, and
              modern aesthetics. Join{" "}
              <strong>1,250+ satisfied customers</strong> who transformed their
              offices with us.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <Link to="/shop">
                <button className="group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg">
                  <ShoppingCart className="mr-3 w-6 h-6" />
                  Shop Premium Collection
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>

              <button
                onClick={() => setShowVideoModal(true)}
                className="group border-2 border-white/80 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg backdrop-blur-sm"
              >
                <Play className="mr-3 w-6 h-6 group-hover:text-yellow-500" />
                Watch Our Story
                <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1,250+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-gray-300">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">4.9★</div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">15+</div>
                <div className="text-sm text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-white text-sm font-medium animate-bounce">
              Scroll to explore
            </div>
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center relative">
              <div className="w-1 h-3 bg-white rounded-full mt-3 animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        ref={commitmentRef}
        data-section="commitments"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div
            className={`text-center mb-20 transform transition-all duration-1000 delay-200 ${
              visibleSections.commitments
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-6">
              <Award className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-semibold">
                Why Choose Expert Office Furnish
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
              Experience The
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500">
                Difference
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who've transformed their
              workspaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-1000 ${
                  visibleSections.commitments
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section
        ref={statsRef}
        data-section="stats"
        className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className={`text-center transform transition-all duration-1000 ${
                visibleSections.stats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 font-mono">
                {Math.floor(stats.customers).toLocaleString()}+
              </div>
              <div className="text-gray-300 font-medium">Happy Customers</div>
              <div className="text-sm text-gray-500 mt-1">Worldwide</div>
            </div>
            <div
              className={`text-center transform transition-all duration-1000 delay-100 ${
                visibleSections.stats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 font-mono">
                {Math.floor(stats.products)}+
              </div>
              <div className="text-gray-300 font-medium">Premium Products</div>
              <div className="text-sm text-gray-500 mt-1">In Stock</div>
            </div>
            <div
              className={`text-center transform transition-all duration-1000 delay-200 ${
                visibleSections.stats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 font-mono">
                {stats.reviews.toFixed(1)}★
              </div>
              <div className="text-gray-300 font-medium">Average Rating</div>
              <div className="text-sm text-gray-500 mt-1">From Reviews</div>
            </div>
            <div
              className={`text-center transform transition-all duration-1000 delay-300 ${
                visibleSections.stats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 font-mono">
                {Math.floor(stats.yearsExperience)}+
              </div>
              <div className="text-gray-300 font-medium">Years Experience</div>
              <div className="text-sm text-gray-500 mt-1">In Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testimonials Section */}
      <section
        ref={testimonialsRef}
        data-section="testimonials"
        className="py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${
              visibleSections.testimonials
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-6">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-gray-700 font-semibold">Customer Love</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
              What Our Customers
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500">
                Are Saying
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real customers who transformed their workspaces
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto">
                      <div className="text-center">
                        <div className="flex justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-6 h-6 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                        <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                          "{testimonial.content}"
                        </blockquote>
                        <div className="flex items-center justify-center space-x-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full border-4 border-yellow-200"
                          />
                          <div className="text-left">
                            <div className="font-bold text-gray-900 text-lg">
                              {testimonial.name}
                            </div>
                            <div className="text-gray-600">
                              {testimonial.position}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-yellow-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        ref={productsRef}
        data-section="products"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative"
        id="products"
      >
        <div className="relative z-10">
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${
              visibleSections.products
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
                {" "}
                Products
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our handpicked selection of premium office furniture
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:scale-105 ${
                    visibleSections.products
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || "/api/placeholder/300/200"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        Stock: {product.stock_quantity}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <button className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <button className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center">
                Explore All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section
        ref={blogRef}
        data-section="blog"
        className="py-24 bg-gradient-to-br from-gray-100 via-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${
              visibleSections.blog
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Insights
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Stay updated with the latest trends in office design and workspace
              optimization
            </p>
          </div>

          {isBlogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:scale-105 ${
                    visibleSections.blog
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image_url || "/api/placeholder/400/250"}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/blog">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center">
                Explore All Articles
                <BookOpen className="ml-2 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
