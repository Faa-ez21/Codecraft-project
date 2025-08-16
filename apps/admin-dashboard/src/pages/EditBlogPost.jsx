import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  FileText,
  User,
  Calendar,
  Tag,
  Save,
  ArrowLeft,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  Type,
  Image as ImageIcon,
  Loader,
} from "lucide-react";

export default function EditBlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    date: "",
    excerpt: "",
    tags: "",
    status: "draft",
    featured_image: "",
    seo_title: "",
    seo_description: "",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Failed to load blog post: " + error.message);
        setLoading(false);
        return;
      }

      const postData = {
        title: data.title || "",
        content: data.content || "",
        author: data.author || "",
        date: data.date?.split("T")[0] || "",
        excerpt: data.excerpt || "",
        tags: data.tags?.join(", ") || "",
        status: data.status || "draft",
        featured_image: data.featured_image || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
      };

      setPost(data);
      setFormData(postData);
      setOriginalData(postData);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return false;
    }
    if (!formData.author.trim()) {
      setError("Author is required");
      return false;
    }
    if (!formData.date) {
      setError("Date is required");
      return false;
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          date: formData.date,
          excerpt: formData.excerpt,
          tags: tagsArray,
          status: formData.status,
          featured_image: formData.featured_image,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        setError("Failed to update post: " + error.message);
      } else {
        navigate("/content/blog-posts", {
          state: { message: "Blog post updated successfully" },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const getWordCount = () => {
    return formData.content.trim().split(/\s+/).filter(Boolean).length;
  };

  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const words = getWordCount();
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Error Loading Post
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/content/blog-posts")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/content/blog-posts")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Edit Blog Post
            </h1>
            <p className="text-gray-600 mt-1">
              Update your blog post content and settings
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              <span>{getWordCount()} words</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime()} min read</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "edit"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Edit Content
                </div>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </div>
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "seo"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  SEO & Meta
                </div>
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "edit" && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    placeholder="Enter an engaging title..."
                    required
                  />
                </div>

                {/* Content with Toolbar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-0 focus:ring-0 min-h-[400px] resize-none"
                      placeholder="Write your blog post content here..."
                      required
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the post..."
                  />
                </div>

                {/* Meta Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Author name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tags and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {formData.title || "Untitled Post"}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <span>By {formData.author || "Unknown Author"}</span>
                      <span>•</span>
                      <span>
                        {formData.date
                          ? new Date(formData.date).toLocaleDateString()
                          : "No date"}
                      </span>
                      <span>•</span>
                      <span>{getReadingTime()} min read</span>
                    </div>
                  </div>

                  {formData.excerpt && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-700 italic">{formData.excerpt}</p>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {formData.content || "No content available"}
                    </div>
                  </div>

                  {formData.tags && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optimized title for search engines"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seo_title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description for search engine results"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seo_description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {hasChanges() ? (
                  <span className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    Unsaved changes
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    All changes saved
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/content/blog-posts")}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !hasChanges()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
