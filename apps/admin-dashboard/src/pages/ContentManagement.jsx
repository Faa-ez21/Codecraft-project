import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ImageIcon,
  FileTextIcon,
  PackageIcon,
  UploadIcon,
  ArrowRight,
  Zap,
  BarChart3,
  Settings,
  Layers,
  PenTool,
  Camera,
  Globe,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";

export default function ContentManagement() {
  const [contentStats, setContentStats] = useState({
    blogPosts: { total: 0, published: 0, lastUpdated: "Loading..." },
    products: { total: 0, lastUpdated: "Loading..." },
    banners: { total: 0, lastUpdated: "Loading..." },
  });

  useEffect(() => {
    fetchContentStats();
  }, []);

  const fetchContentStats = async () => {
    try {
      // Fetch blog posts stats
      const { data: blogPosts, error: blogError } = await supabase
        .from("blog_posts")
        .select("id, status, updated_at")
        .order("updated_at", { ascending: false });

      if (blogError) {
        console.error("Error fetching blog posts:", blogError);
      }

      // Fetch products stats (if you have a products table)
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, updated_at")
        .order("updated_at", { ascending: false });

      if (productError) {
        console.error("Error fetching products:", productError);
      }

      // Fetch banners stats (if you have a banners table)
      const { data: banners, error: bannerError } = await supabase
        .from("homepage_banners")
        .select("id, updated_at")
        .order("updated_at", { ascending: false });

      if (bannerError) {
        console.error("Error fetching banners:", bannerError);
      }

      // Calculate stats
      const blogStats = {
        total: blogPosts?.length || 0,
        published:
          blogPosts?.filter((post) => post.status === "Published").length || 0,
        lastUpdated: blogPosts?.[0]?.updated_at
          ? formatTimeAgo(new Date(blogPosts[0].updated_at))
          : "No posts yet",
      };

      const productStats = {
        total: products?.length || 0,
        lastUpdated: products?.[0]?.updated_at
          ? formatTimeAgo(new Date(products[0].updated_at))
          : "No products yet",
      };

      const bannerStats = {
        total: banners?.length || 0,
        lastUpdated: banners?.[0]?.updated_at
          ? formatTimeAgo(new Date(banners[0].updated_at))
          : "No banners yet",
      };

      setContentStats({
        blogPosts: blogStats,
        products: productStats,
        banners: bannerStats,
      });
    } catch (error) {
      console.error("Error fetching content stats:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };
  const contentSections = [
    {
      title: "Products",
      description: "Manage your product catalog",
      fullDescription:
        "Add, edit, delete products and manage product images, categories, and inventory",
      icon: PackageIcon,
      color: "from-blue-500 to-cyan-500",
      link: "/products",
      stats: {
        items: contentStats.products.total.toString(),
        updated: contentStats.products.lastUpdated,
      },
      features: ["Product CRUD", "Image Management", "Categories", "Inventory"],
    },
    {
      title: "Homepage Banners",
      description: "Control your homepage presentation",
      fullDescription:
        "Manage banner images, promotional content, and featured sections on your homepage",
      icon: ImageIcon,
      color: "from-green-500 to-emerald-500",
      link: "/content/banners",
      stats: {
        items: contentStats.banners.total.toString(),
        updated: contentStats.banners.lastUpdated,
      },
      features: ["Banner Upload", "Positioning", "Scheduling", "Analytics"],
    },
    {
      title: "Blog Posts",
      description: "Create and manage blog content",
      fullDescription:
        "Write, edit, and publish blog posts, health tips, and company news",
      icon: FileTextIcon,
      color: "from-purple-500 to-pink-500",
      link: "/content/blogs",
      stats: {
        items: `${contentStats.blogPosts.total} (${contentStats.blogPosts.published} published)`,
        updated: contentStats.blogPosts.lastUpdated,
      },
      features: ["Rich Editor", "SEO Tools", "Publishing", "Comments"],
    },
    {
      title: "Media Library",
      description: "Upload and organize media files",
      fullDescription:
        "Upload images to Supabase storage for products, banners, and blog posts",
      icon: UploadIcon,
      color: "from-yellow-500 to-orange-500",
      link: "/content/media-upload",
      stats: { items: "Storage", updated: "Always available" },
      features: ["File Upload", "Organization", "Optimization", "CDN"],
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      icon: PackageIcon,
      link: "/products/add",
      color: "blue",
    },
    {
      title: "Create Blog Post",
      icon: PenTool,
      link: "/content/blogs/create",
      color: "purple",
    },
    {
      title: "Upload Banner",
      icon: Camera,
      link: "/content/banners",
      color: "green",
    },
    {
      title: "View Analytics",
      icon: BarChart3,
      link: "/analytics",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Content Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your website content from one central hub
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="w-4 h-4" />
              <span>Last updated: 2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Total Content",
              value: "703",
              icon: Layers,
              color: "from-blue-500 to-cyan-500",
              change: "+12%",
            },
            {
              title: "Published",
              value: "645",
              icon: Eye,
              color: "from-green-500 to-emerald-500",
              change: "+8%",
            },
            {
              title: "Monthly Views",
              value: "24.5K",
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500",
              change: "+25%",
            },
            {
              title: "Contributors",
              value: "8",
              icon: Users,
              color: "from-yellow-500 to-orange-500",
              change: "+2%",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-green-500 text-xs font-semibold mt-1">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`p-3 rounded-xl mb-3 transition-all duration-300 group-hover:scale-110 ${
                    action.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : action.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : action.color === "green"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-green-600 transition-colors duration-300">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contentSections.map((section, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {section.fullDescription}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-semibold text-gray-800">
                      {section.stats.items}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-semibold text-gray-800">
                      {section.stats.updated}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {section.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link to={section.link}>
                  <button
                    className={`w-full bg-gradient-to-r ${section.color} text-white py-3 px-6 rounded-2xl font-semibold 
                                       hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center group`}
                  >
                    <span>Manage {section.title}</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                action: "New product added",
                time: "2 hours ago",
                type: "product",
              },
              {
                action: "Blog post published",
                time: "5 hours ago",
                type: "blog",
              },
              { action: "Banner updated", time: "1 day ago", type: "banner" },
              {
                action: "Media files uploaded",
                time: "2 days ago",
                type: "media",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "product"
                        ? "bg-blue-500"
                        : activity.type === "blog"
                        ? "bg-purple-500"
                        : activity.type === "banner"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    {activity.action}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
