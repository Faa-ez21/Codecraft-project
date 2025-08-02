import { Link } from "react-router-dom";
import { ImageIcon, FileTextIcon } from "lucide-react";

export default function ContentManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      {/* Homepage Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Homepage</h2>
        <Link
          to="/content/banners"
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ImageIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <div>
            <p className="font-medium">Homepage Banners</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage the banners on the homepage
            </p>
          </div>
        </Link>
      </section>

      {/* Blog Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Blog</h2>
        <Link
          to="/content/blogs"
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FileTextIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <div>
            <p className="font-medium">Blog Posts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage blog posts and health tips
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
