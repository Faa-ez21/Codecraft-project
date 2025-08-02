import { useState } from "react";

export default function EditBannerModal({ banner, onClose, onSave }) {
  const [title, setTitle] = useState(banner.title);
  const [displayPeriod, setDisplayPeriod] = useState(banner.displayPeriod);
  const [linkTo, setLinkTo] = useState(banner.linkTo);
  const [status, setStatus] = useState(banner.status);

  const handleSave = () => {
    onSave({
      ...banner,
      title,
      displayPeriod,
      linkTo,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-semibold">Edit Banner</h2>

        <div>
          <label htmlFor="banner-title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="banner-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label htmlFor="display-period" className="block text-sm font-medium mb-1">
            Display Period
          </label>
          <input
            id="display-period"
            value={displayPeriod}
            onChange={(e) => setDisplayPeriod(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="e.g. July 1 - July 31"
          />
        </div>

        <div>
          <label htmlFor="link-to" className="block text-sm font-medium mb-1">
            Link To
          </label>
          <input
            id="link-to"
            value={linkTo}
            onChange={(e) => setLinkTo(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="Enter product or category"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
