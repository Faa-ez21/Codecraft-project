// src/pages/BlogPostList.jsx
import { Link } from "react-router-dom";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";

export default function BlogPostList() {
  // Dummy data — replace with real data from your backend later
  const blogPosts = [
    {
      id: 1,
      title: "5 Health Tips for Office Workers",
      author: "Admin",
      date: "2025-07-29",
    },
    {
      id: 2,
      title: "Choosing Ergonomic Furniture",
      author: "Franklin",
      date: "2025-07-25",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link
          to="/content/blogs/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{post.title}</td>
                <td className="p-4">{post.author}</td>
                <td className="p-4">{post.date}</td>
                <td className="p-4 flex gap-2">
                  <Link
                    to={`/content/blogs/edit/${post.id}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </Link>
                  <button className="text-red-600 hover:underline flex items-center gap-1">
                    <Trash2Icon className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {blogPosts.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
