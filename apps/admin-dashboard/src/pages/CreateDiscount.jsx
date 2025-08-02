// src/pages/CreateDiscount.jsx

export default function CreateDiscount() {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Create Discount</h1>

      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Discount Name</label>
            <input
              type="text"
              placeholder="e.g. Summer Sale"
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Discount Code</label>
            <input
              type="text"
              placeholder="e.g. SUMMER20"
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Discount Type</label>
            <select className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
              <option value="">Select</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Discount Value</label>
            <input
              type="text"
              placeholder="e.g. 20"
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Start Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">End Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Minimum Order Value</label>
          <input
            type="number"
            placeholder="e.g. 100"
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Maximum Discount Amount</label>
          <input
            type="number"
            placeholder="e.g. 50"
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input type="checkbox" id="apply-all" className="text-green-600 rounded" />
          <label htmlFor="apply-all" className="text-sm text-gray-700 dark:text-gray-300">
            Apply to all customers
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mt-4"
        >
          Create Discount
        </button>
      </form>
    </div>
  );
}
