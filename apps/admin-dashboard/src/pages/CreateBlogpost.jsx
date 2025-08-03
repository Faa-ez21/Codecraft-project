// src/pages/CreateBlogPosts.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreateBlogPosts() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  // Fetch existing blog posts
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, status, created_at, users(name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error.message);
      } else {
        setPosts(data);
      }
    }

    fetchPosts();
  }, []);

  // Handle blog post creation
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !content || !user) {
      alert("Please fill out all fields and ensure you're logged in.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("blog_posts").insert({
      title,
      content,
      status,
      author_id: user.id,
    });

    if (error) {
      console.error("Error creating blog post:", error.message);
      alert("Error creating blog post.");
    } else {
      setTitle("");
      setContent("");
      setStatus("Draft");
      alert("Blog post created!");
      window.location.reload(); // reload to refresh the list
    }

    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage blog posts and health tips displayed on your website.
      </p>

      {/* Existing posts table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Author</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-2">{post.title}</td>
                <td className="p-2">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="p-2">{post.users?.name || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create new post */}
      <h2 className="text-xl font-semibold mb-4">Add New Blog Post</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full border rounded px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write blog content..."
          className="w-full border rounded px-4 py-2 min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select
          className="w-full border rounded px-4 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Blog Post"}
        </button>
      </form>
    </div>
  );
}
