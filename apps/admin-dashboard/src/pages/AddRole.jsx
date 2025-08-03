import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const AddRole = () => {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState('Active');
  const [permissions, setPermissions] = useState({
    'Manage Products': false,
    'Manage Orders': false,
    'Manage Users': false,
    'Manage Content Management': false,
    'Manage Categories': false,
    'Manage Customers': false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const selectedPermissions = Object.entries(permissions)
      .filter(([, value]) => value)
      .map(([key]) => key);

    const { error } = await supabase.from('roles').insert([
      {
        id: uuidv4(),
        name: roleName,
        status,
        permissions: selectedPermissions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin-roles');
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">Add Role</h1>

      <form className="max-w-lg space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Permissions</label>
          <div className="space-y-2 mt-2">
            {Object.keys(permissions).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={permissions[key]}
                  onChange={handlePermissionChange}
                />
                {key}
              </label>
            ))}
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

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          {loading ? 'Saving...' : 'Save Role'}
        </button>
      </form>
    </div>
  );
};

export default AddRole;
