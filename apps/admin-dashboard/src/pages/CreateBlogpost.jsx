// src/pages/CreateBlogPosts.jsx
import { useState } from "react";

export default function CreateBlogPosts() {
  const [posts, setPosts] = useState([
    {
      title: "How to Choose Office Furniture",
      date: "July 15, 2025",
      status: "Published",
    },
    {
      title: "Health Tips for Desk Workers",
      date: "July 5, 2025",
      status: "Draft",
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage blog posts and health tips displayed on your website's blog
        section.
      </p>

      {/* Table of Existing Posts */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{post.title}</td>
                <td className="p-2">{post.date}</td>
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
                <td className="p-2 text-blue-600 cursor-pointer hover:underline">
                  Edit
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Post */}
      <h2 className="text-xl font-semibold mb-4">Add New Blog Post</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full border rounded px-4 py-2"
        />
        <textarea
          placeholder="Write blog content..."
          className="w-full border rounded px-4 py-2 min-h-[150px]"
        />
        <select className="w-full border rounded px-4 py-2">
          <option>Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Blog Post
        </button>
      </form>
    </div>
  );
}
