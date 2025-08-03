import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to load roles');
      } else {
        setRoles(data);
      }

      setLoading(false);
    };

    fetchRoles();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage roles and permissions for system administrators.</p>
        </div>
        <Link
          to="/add-role"
          className="inline-block bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800 transition"
        >
          Add Role
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading roles...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : roles.length === 0 ? (
        <p className="text-gray-500">No roles found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black/5 dark:ring-white/10">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Permissions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {(role.permissions || []).join(', ')}
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
      )}
    </div>
  );
}
