import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Eye,
  TrendingUp,
  Calendar as CalendarIcon,
  Tag,
} from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allTags, setAllTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        // Set dummy data as fallback
        setBlogs(getDummyBlogs());
      } else {
        setBlogs(data || []);
      }

      // Extract all unique tags
      const tags = new Set();
      (data || getDummyBlogs()).forEach((blog) => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach((tag) => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs(getDummyBlogs());
    } finally {
      setLoading(false);
    }
  };

  const getDummyBlogs = () => [
    {
      id: 1,
      title: "Essential Office Furniture for Remote Workers",
      excerpt:
        "Discover the must-have furniture pieces that can transform your home office into a productivity powerhouse.",
      content:
        "Creating an effective home office requires careful consideration...",
      image_url: null,
      created_at: new Date().toISOString(),
      tags: ["office furniture", "remote work", "productivity"],
      status: "Published",
    },
    {
      id: 2,
      title: "Latest Trends in Modern Office Design",
      excerpt:
        "Explore the cutting-edge trends shaping contemporary office spaces and how they impact employee wellbeing.",
      content: "The office landscape continues to evolve...",
      image_url: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      tags: ["office design", "modern furniture", "workplace trends"],
      status: "Published",
    },
    {
      id: 3,
      title: "How to Choose the Perfect Office Chair",
      excerpt:
        "A comprehensive guide to selecting an office chair that supports your health, comfort, and productivity.",
      content:
        "Selecting the right office chair is one of the most important decisions...",
      image_url: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      tags: ["office chair", "ergonomics", "workplace comfort"],
      status: "Published",
    },
  ];

  const filterBlogs = () => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.tags &&
            blog.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Filter by category/tag
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (blog) => blog.tags && blog.tags.includes(selectedCategory)
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-bl from-green-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-blue-100/25 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-50/20 to-green-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover insights, tips, and expert advice on office furniture,
            workspace design, and creating productive environments that inspire
            success.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {blogs.length}
              </div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {allTags.length}
              </div>
              <div className="text-sm text-gray-600">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">100K+</div>
              <div className="text-sm text-gray-600">Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white min-w-[200px]"
              >
                <option value="all">All Categories</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBlogs.length} of {blogs.length} articles
            {searchTerm && (
              <span>
                {" "}
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        {currentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog, index) => (
              <article
                key={blog.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-gray-200 overflow-hidden animate-fadeInUp"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Blog Image */}
                <div className="relative overflow-hidden group/image">
                  {blog.image_url ? (
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white hover:shadow-lg"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {calculateReadTime(blog.content)} min
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{blog.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More Button */}
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group/link"
                  >
                    Read Article
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new articles"}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNumber
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest articles and office furniture tips delivered to your
            inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
