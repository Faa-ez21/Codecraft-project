import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    date: "",
  });

  useEffect(() => {
    // Fetch the post by ID
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blogposts/${id}`);
        const data = await res.json();
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content,
          author: data.author,
          date: data.date,
        });
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/blogposts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/content/blog-posts");
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border px-4 py-2 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Content</label>
          <textarea
            name="content"
            className="w-full border px-4 py-2 rounded min-h-[200px]"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Author</label>
            <input
              type="text"
              name="author"
              className="w-full border px-4 py-2 rounded"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              className="w-full border px-4 py-2 rounded"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
