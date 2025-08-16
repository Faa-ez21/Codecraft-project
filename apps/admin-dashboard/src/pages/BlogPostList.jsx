import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Clock,
  Grid,
  List,
  MoreVertical,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function BlogPostList() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedPosts, setSelectedPosts] = useState(new Set());

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
    } else {
      setBlogPosts(data || []);
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting post:", error);
    } else {
      setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedPosts.size} selected posts?`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .in("id", Array.from(selectedPosts));
    if (error) {
      console.error("Error deleting posts:", error);
    } else {
      setBlogPosts((prev) =>
        prev.filter((post) => !selectedPosts.has(post.id))
      );
      setSelectedPosts(new Set());
    }
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: blogPosts.length,
    published: blogPosts.filter((p) => p.status === "published").length,
    draft: blogPosts.filter((p) => p.status === "draft").length,
    recent: blogPosts.filter(
      (p) =>
        new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Blog Posts
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your blog content and articles
              </p>
            </div>
            <Link
              to="/content/blogs/create"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold 
                       hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl flex items-center gap-2 w-fit group"
            >
              <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Post
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Total Posts",
              value: stats.total,
              icon: FileText,
              color: "from-blue-500 to-cyan-500",
              change: "+12%",
            },
            {
              title: "Published",
              value: stats.published,
              icon: Eye,
              color: "from-green-500 to-emerald-500",
              change: "+8%",
            },
            {
              title: "Drafts",
              value: stats.draft,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              change: "+3%",
            },
            {
              title: "This Week",
              value: stats.recent,
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500",
              change: "+15%",
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

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {selectedPosts.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
                >
                  Delete Selected ({selectedPosts.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts(
                              new Set(filteredPosts.map((p) => p.id))
                            );
                          } else {
                            setSelectedPosts(new Set());
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Author
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-t border-gray-100 hover:bg-green-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPosts.has(post.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedPosts);
                            if (e.target.checked) {
                              newSelected.add(post.id);
                            } else {
                              newSelected.delete(post.id);
                            }
                            setSelectedPosts(newSelected);
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {post.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {post.excerpt || "No excerpt available"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {post.author_id || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status || "draft"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/content/blogs/edit/${post.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Edit Post"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete Post"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">
                              No blog posts found
                            </p>
                            <p className="text-gray-400 text-sm">
                              Create your first blog post to get started
                            </p>
                          </div>
                          <Link
                            to="/content/blogs/create"
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                          >
                            Create First Post
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status || "draft"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt || "No excerpt available"}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author_id || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/content/blogs/edit/${post.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-center text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors duration-200"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
