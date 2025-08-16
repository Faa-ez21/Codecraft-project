import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  FileText,
  User,
  Calendar,
  Eye,
  Send,
  Image,
  Bold,
  Italic,
  List,
  Link2,
  ArrowLeft,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function CreateBlogPosts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [tags, setTags] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    setWordCount(
      content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    );
  }, [content]);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
    } else {
      setUser(data.user);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, status, created_at, users(name)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching blog posts:", error.message);
    } else {
      setPosts(data || []);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `blog-${uuidv4()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setUploading(false);
    return data.publicUrl;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = await uploadImage(file);
      if (url) {
        setImageUrl(url);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !user) {
      alert("Please fill out all required fields and ensure you're logged in.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("blog_posts").insert({
      title,
      excerpt: excerpt || content.substring(0, 160) + "...",
      content,
      status,
      author_id: user.id,
      image_url: imageUrl || null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    });

    if (error) {
      console.error("Error creating blog post:", error.message);
      alert("Error creating blog post.");
    } else {
      setTitle("");
      setExcerpt("");
      setContent("");
      setTags("");
      setStatus("Draft");
      setImage(null);
      setImageUrl("");
      alert("Blog post created successfully!");
      fetchPosts(); // Refresh the list
    }

    setLoading(false);
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "Published").length,
    drafts: posts.filter((p) => p.status === "Draft").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/content/blogs")}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Create Blog Post
                </h1>
                <p className="text-gray-600 mt-1">
                  Write and publish engaging content for your audience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>{user?.email || "Not logged in"}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-6 shadow-lg border border-white/20">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              Create New Post
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === "recent"
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              Recent Posts
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an engaging title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Excerpt
                  </label>
                  <textarea
                    placeholder="Brief description of your post (optional)..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to auto-generate from content
                  </p>
                </div>

                {/* Featured Image */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Featured Image
                  </label>

                  {!imageUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="mt-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            <span className="text-sm text-gray-600">
                              Uploading...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Content *
                    </label>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{wordCount} words</span>
                      <span>≈ {Math.ceil(wordCount / 200)} min read</span>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-4">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="List"
                    >
                      <List className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Link"
                    >
                      <Link2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Image"
                    >
                      <Image className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <textarea
                    placeholder="Write your blog content here... Use markdown for formatting."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none font-mono text-sm"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Example: office furniture, productivity, workspace design
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Options */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-600" />
                  Publish Options
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date().toLocaleDateString()}</span>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || !title || !content}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold 
                             hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 
                             shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        {status === "Published" ? "Publish Post" : "Save Draft"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Writing Tips */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Writing Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Write compelling headlines that grab attention</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use subheadings to break up long content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Include relevant images and examples</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Aim for 800-1500 words for optimal engagement</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.total}
                    </p>
                    <p className="text-xs text-blue-600">Total Posts</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.published}
                    </p>
                    <p className="text-xs text-green-600">Published</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Recent Posts Tab */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Posts
              </h2>
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            <span>{post.users?.name || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No blog posts yet</p>
                  <p className="text-gray-400 text-sm">
                    Create your first post to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
