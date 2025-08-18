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

  // Delete blog post function
  const deletePost = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) {
        console.error("Error deleting blog post:", error);
        alert("Error deleting blog post. Please try again.");
      } else {
        alert("Blog post deleted successfully!");
        fetchPosts(); // Refresh the list
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  // Blog post generator for when admin doesn't know what to write
  const generateBlogPost = () => {
    const blogTopics = [
      {
        title: "Essential Office Furniture for Remote Workers",
        excerpt:
          "Discover the must-have furniture pieces that can transform your home office into a productivity powerhouse.",
        content: `# Essential Office Furniture for Remote Workers

The rise of remote work has transformed how we think about office spaces. Creating an effective home office requires careful consideration of furniture that promotes both comfort and productivity.

## The Foundation: A Quality Desk

Your desk is the centerpiece of your workspace. Consider these factors when choosing:
- **Size**: Ensure adequate space for your computer, documents, and personal items
- **Height**: Adjustable height desks offer flexibility for standing and sitting
- **Storage**: Built-in drawers and compartments help maintain organization

## Ergonomic Seating Solutions

A good chair is an investment in your health and productivity:
- Look for lumbar support to maintain proper posture
- Adjustable armrests reduce shoulder strain
- Quality wheels and swivel mechanisms improve mobility

## Storage and Organization

Effective storage solutions keep your workspace clutter-free:
- File cabinets for important documents
- Shelving units for books and supplies
- Desktop organizers for immediate needs

## Lighting and Ambiance

Proper lighting reduces eye strain and improves mood:
- Task lighting for focused work
- Ambient lighting for overall workspace illumination
- Natural light positioning to reduce glare

## Creating Your Ideal Workspace

Remember, the best office furniture is what works for your specific needs, space, and budget. Take time to assess your work habits and choose pieces that support your productivity goals.`,
        tags: "office furniture, remote work, productivity, ergonomics",
      },
      {
        title: "Latest Trends in Modern Office Design",
        excerpt:
          "Explore the cutting-edge trends shaping contemporary office spaces and how they impact employee wellbeing.",
        content: `# Latest Trends in Modern Office Design

The office landscape continues to evolve, driven by changing work patterns and a deeper understanding of how environment affects productivity and wellbeing.

## Biophilic Design Elements

Incorporating nature into office spaces has become a dominant trend:
- Living walls and indoor plants improve air quality
- Natural materials like wood and stone create warmth
- Water features and natural lighting enhance the environment

## Flexible and Modular Furniture

Modern offices require adaptability:
- Modular seating arrangements that can be reconfigured
- Mobile storage solutions that move with teams
- Height-adjustable desks for sit-stand flexibility

## Technology Integration

Seamless technology integration is essential:
- Built-in charging stations and cable management
- Smart furniture with embedded sensors
- Wireless charging surfaces integrated into desks

## Wellness-Focused Spaces

Employee wellbeing drives design decisions:
- Quiet zones for focused work
- Collaboration areas with comfortable seating
- Relaxation spaces with ergonomic loungers

## Sustainable Materials

Environmental consciousness influences furniture choices:
- Recycled and upcycled materials
- Low-emission finishes and fabrics
- Furniture designed for longevity and repairability

## Color Psychology in Office Design

Strategic color choices impact mood and productivity:
- Blue tones for focus and concentration
- Green hues for balance and calm
- Warm accents for energy and creativity

The future of office design lies in creating spaces that adapt to human needs while supporting both individual productivity and collaborative success.`,
        tags: "office design, modern furniture, workplace trends, wellness",
      },
      {
        title: "How to Choose the Perfect Office Chair",
        excerpt:
          "A comprehensive guide to selecting an office chair that supports your health, comfort, and productivity.",
        content: `# How to Choose the Perfect Office Chair

Selecting the right office chair is one of the most important decisions you can make for your workspace. With the average office worker spending 8+ hours daily seated, the impact on health and productivity is significant.

## Understanding Ergonomic Principles

### Lumbar Support
- The chair should support the natural curve of your spine
- Adjustable lumbar support accommodates different body types
- Proper support reduces back pain and fatigue

### Seat Height and Depth
- Feet should rest flat on the floor with thighs parallel to the ground
- Seat depth should allow 2-3 inches between the back of knees and seat edge
- Pneumatic height adjustment is essential for proper positioning

## Key Features to Consider

### Armrest Adjustability
- Height adjustment to support arms at 90-degree angles
- Width adjustment for different body sizes
- Some chairs offer 4D armrests with forward/backward movement

### Material and Padding
- Breathable mesh backs promote air circulation
- Quality foam padding maintains shape over time
- Fabric choices affect durability and maintenance

### Swivel and Mobility
- 360-degree swivel for easy movement
- Quality casters appropriate for your flooring
- Stable five-point base for safety

## Testing and Selection Process

### In-Person Evaluation
- Sit in the chair for at least 15 minutes
- Test all adjustment mechanisms
- Ensure the chair accommodates your body proportions

### Considering Your Work Style
- Task chairs for focused computer work
- Executive chairs for varied daily activities
- Specialized chairs for specific industries

## Budget Considerations

Quality office chairs are an investment in your health:
- Entry-level ergonomic chairs: $200-$500
- Mid-range options with advanced features: $500-$1,000
- Premium chairs with extensive adjustability: $1,000+

## Maintenance and Longevity

Proper care extends chair life:
- Regular cleaning according to manufacturer instructions
- Periodic adjustment checks and tightening
- Professional servicing for complex mechanisms

Remember, the best office chair is one that fits your body, supports your work habits, and maintains comfort throughout long working sessions.`,
        tags: "office chair, ergonomics, workplace comfort, health",
      },
      {
        title: "Creating a Productive Home Office Space",
        excerpt:
          "Transform any space into an efficient home office with smart furniture choices and layout strategies.",
        content: `# Creating a Productive Home Office Space

Working from home requires intentional space design to maintain productivity and work-life balance. The right furniture and layout can transform any area into an effective workspace.

## Space Assessment and Planning

### Evaluating Available Space
- Identify the quietest area in your home
- Ensure adequate natural light when possible
- Consider proximity to internet connections and outlets
- Measure the space to plan furniture placement

### Defining Work Zones
- Dedicated work area separate from relaxation spaces
- Storage zone for supplies and documents
- Technology setup area for equipment

## Essential Furniture Pieces

### The Work Surface
- Desk size should accommodate your equipment and work style
- Consider L-shaped desks for multiple monitor setups
- Standing desk options for health benefits
- Ensure proper depth for monitor distance

### Seating Solutions
- Invest in a quality ergonomic chair
- Consider a secondary seating option for breaks
- Bar-height seating for standing desk configurations

### Storage Systems
- Filing cabinets for important documents
- Bookcases for reference materials
- Desktop organizers for daily supplies
- Hidden storage to maintain clean aesthetics

## Optimizing Layout and Flow

### Traffic Patterns
- Ensure easy movement around the workspace
- Position frequently used items within arm's reach
- Create clear pathways to avoid distractions

### Technology Integration
- Plan cable management solutions
- Position equipment to minimize glare
- Ensure adequate ventilation for electronics

## Lighting and Environment

### Natural Light Optimization
- Position desk perpendicular to windows to reduce glare
- Use adjustable blinds to control brightness
- Consider light-colored furniture to reflect light

### Artificial Lighting Solutions
- Task lighting for detailed work
- Ambient lighting for overall illumination
- Adjustable desk lamps for flexibility

## Personalizing Your Space

### Adding Character
- Incorporate personal items that inspire
- Use plants to improve air quality and mood
- Choose colors that promote focus and creativity

### Maintaining Boundaries
- Physical separation between work and personal areas
- Consistent work hours to maintain routine
- End-of-day rituals to transition from work mode

## Budget-Friendly Solutions

Creating an effective home office doesn't require a large investment:
- Repurpose existing furniture with modifications
- Shop for quality used office furniture
- Invest in key pieces first, then upgrade over time
- DIY solutions for storage and organization

The key to a successful home office is creating a space that supports your work style while maintaining comfort and inspiration throughout the day.`,
        tags: "home office, productivity, workspace design, remote work",
      },
    ];

    const randomTopic =
      blogTopics[Math.floor(Math.random() * blogTopics.length)];

    setTitle(randomTopic.title);
    setExcerpt(randomTopic.excerpt);
    setContent(randomTopic.content);
    setTags(randomTopic.tags);
    setStatus("Draft");

    alert(
      "Blog post generated! Feel free to edit the content to match your needs."
    );
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

              {/* Blog Post Generator */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Need Inspiration?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Not sure what to write about? Generate a complete blog post
                  with title, content, and tags to get you started!
                </p>
                <button
                  type="button"
                  onClick={generateBlogPost}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold 
                           hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 
                           shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Generate Blog Post
                </button>
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status}
                        </span>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                          title="Delete post"
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
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
