import React from 'react';
import { useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams(); // For now, dummy use of ID

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Admin</h1>
      <form className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="Role"
          className="w-full border border-gray-300 rounded p-2"
        />
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Manage Products
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Manage Orders
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Manage Users
          </label>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUser;
