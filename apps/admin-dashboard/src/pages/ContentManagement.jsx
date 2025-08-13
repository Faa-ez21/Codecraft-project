import { Link } from "react-router-dom";
import { ImageIcon, FileTextIcon, PackageIcon, UploadIcon } from "lucide-react";

export default function ContentManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <Link
          to="/products"
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <PackageIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <div>
            <p className="font-medium">Manage Products</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add, edit, delete products and manage product images
            </p>
          </div>
        </Link>
      </section>

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
      <section className="mb-8">
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

      {/* Media Upload Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Media & Images</h2>
        <Link
          to="/content/media-upload"
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <UploadIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <div>
            <p className="font-medium">Upload Images</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload images to Supabase storage for products or banners
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
