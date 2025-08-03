import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust if needed

export default function HomepageBanners() {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    display_start: "",
    display_end: "",
    link_url: "",
    image_url: "",
    status: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase.from("homepage_banners").select("*");
    if (error) console.error("Error fetching banners:", error);
    else setBanners(data);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("homepage_banners").insert([formData]);
    if (error) {
      console.error("Error saving banner:", error.message);
    } else {
      fetchBanners();
      setFormData({
        title: "",
        display_start: "",
        display_end: "",
        link_url: "",
        image_url: "",
        status: true,
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Homepage Banners</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage banners shown on the homepage.
      </p>

      {/* Banners Table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Display Period</th>
              <th className="p-2">Link</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-t">
                <td className="p-2">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2">{banner.title}</td>
                <td className="p-2">
                  {new Date(banner.display_start).toLocaleDateString()} -{" "}
                  {new Date(banner.display_end).toLocaleDateString()}
                </td>
                <td className="p-2">{banner.link_url}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      banner.status
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.status ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Banner Form */}
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Banner Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            type="text"
            placeholder="e.g. Summer Sale"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Start</label>
            <input
              name="display_start"
              value={formData.display_start}
              onChange={handleInputChange}
              type="datetime-local"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display End</label>
            <input
              name="display_end"
              value={formData.display_end}
              onChange={handleInputChange}
              type="datetime-local"
              className="w-full border rounded px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link URL</label>
          <input
            name="link_url"
            value={formData.link_url}
            onChange={handleInputChange}
            type="text"
            placeholder="e.g. /category/living-room"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            type="text"
            placeholder="e.g. https://..."
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            name="status"
            checked={formData.status}
            onChange={handleInputChange}
            type="checkbox"
          />
          <label className="text-sm">Active</label>
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
