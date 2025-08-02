import React from 'react';

const AddUser = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Team Member</h1>
      <form className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select className="w-full border border-gray-300 rounded p-2 mt-1">
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mt-4">Permissions</label>
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
              Manage Customers
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Manage Team
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddUser;
