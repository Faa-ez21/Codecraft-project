import React from 'react';
import { Link } from 'react-router-dom';

const roles = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: 'Full access to all features and settings',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Product Manager',
    permissions: 'Manage products, categories, and inventory',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Order Manager',
    permissions: 'Manage orders, shipments, and returns',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Customer Support',
    permissions: 'View customer information and respond to inquiries',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Marketing Specialist',
    permissions: 'Manage promotions, discounts, and email campaigns',
    status: 'Inactive',
  },
];

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
};

export default function AdminRoles() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Roles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage roles and permissions for system administrators.
          </p>
        </div>
        <Link
          to="/add-role"
          className="inline-block bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition"
        >
          Add Role
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black/5 dark:ring-white/10">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {role.permissions}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={role.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/edit-role/${role.id}`}
                    className="text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-200 text-sm font-medium"
                  >
                    ✏️ Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
