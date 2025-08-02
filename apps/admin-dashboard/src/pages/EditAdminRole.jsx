import React, { useState } from 'react';

const EditAdminRole = () => {
  const [roleName, setRoleName] = useState('Product Manager');
  const [status, setStatus] = useState('Active');
  const [permissions, setPermissions] = useState({
    products: true,
    orders: false,
    customers: false,
    team: true,
  });

  const handleCheckbox = (perm) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Role</h1>
      <form className="max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Permissions</label>
          <div className="space-y-2 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.products}
                onChange={() => handleCheckbox('products')}
              />
              Manage Products
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.orders}
                onChange={() => handleCheckbox('orders')}
              />
              Manage Orders
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.customers}
                onChange={() => handleCheckbox('customers')}
              />
              Manage Customers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.team}
                onChange={() => handleCheckbox('team')}
              />
              Manage Team
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAdminRole;
