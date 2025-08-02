import React from 'react';

const AddRole = () => {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">Add Role</h1>
      <form className="max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium">Role Name</label>
          <input
            type="text"
            placeholder="Enter role name"
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Permissions</label>
          <div className="space-y-2 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Manage Products
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Manage Orders
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Manage Users
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select className="w-full border border-gray-300 rounded p-2 mt-1">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          Save Role
        </button>
      </form>
    </div>
  );
};

export default AddRole;
