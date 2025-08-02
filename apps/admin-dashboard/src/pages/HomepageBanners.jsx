// src/pages/HomepageBanners.jsx
import { useState } from "react";

export default function HomepageBanners() {
  const [banners, setBanners] = useState([
    {
      title: "Summer Sale",
      displayPeriod: "June 1 - June 30",
      linkTo: "Living Room Furniture",
      status: "Active",
      image: "/banners/summer-sale.jpg",
    },
    {
      title: "New Arrivals",
      displayPeriod: "July 1 - July 31",
      linkTo: "Bedroom Furniture",
      status: "Active",
      image: "/banners/new-arrivals.jpg",
    },
    {
      title: "Dining Sets",
      displayPeriod: "August 1 - August 31",
      linkTo: "Dining Room Furniture",
      status: "Inactive",
      image: "/banners/dining-sets.jpg",
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Homepage Banners</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage the banners displayed on the homepage, including uploading new banners, setting display periods, and linking to products or categories.
      </p>

      {/* Table of Existing Banners */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Display Period</th>
              <th className="p-2">Link To</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="p-2">{banner.title}</td>
                <td className="p-2">{banner.displayPeriod}</td>
                <td className="p-2">{banner.linkTo}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      banner.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.status}
                  </span>
                </td>
                <td className="p-2 text-blue-600 hover:underline cursor-pointer">
                  Edit
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form to Add New Banner */}
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Banner Title</label>
          <input
            type="text"
            placeholder="Enter banner title"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Display Period</label>
          <input
            type="text"
            placeholder="e.g. August 1 - August 31"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link To</label>
          <input
            type="text"
            placeholder="Enter product or category name"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            className="w-full border rounded px-4 py-2 file:mr-4 file:py-1 file:px-2 file:border-0 file:bg-gray-200 file:text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Banner
        </button>
      </form>
    </div>
  );
}
