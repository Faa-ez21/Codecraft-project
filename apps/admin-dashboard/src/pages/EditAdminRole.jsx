import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";

const EditAdminRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState('Active');
  const [permissions, setPermissions] = useState({
    products: false,
    orders: false,
    customers: false,
    team: false,
  });

  // Fetch role data by ID
  useEffect(() => {
    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
        return;
      }

      setRoleName(data.name);
      setStatus(data.status);
      setPermissions({
        products: data.permissions?.includes('products') || false,
        orders: data.permissions?.includes('orders') || false,
        customers: data.permissions?.includes('customers') || false,
        team: data.permissions?.includes('team') || false,
      });
    };

    if (id) fetchRole();
  }, [id]);

  const handleCheckbox = (perm) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPermissions = Object.keys(permissions).filter((key) => permissions[key]);

    const { error } = await supabase
      .from('roles')
      .update({
        name: roleName,
        status,
        permissions: updatedPermissions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      alert('Failed to update role');
      console.error(error);
    } else {
      alert('Role updated successfully');
      navigate('/admin-roles');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this role?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('roles').delete().eq('id', id);

    if (error) {
      alert('Failed to delete role');
      console.error(error);
    } else {
      alert('Role deleted successfully');
      navigate('/admin-roles');
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Role</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
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

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
          >
            Delete Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminRole;
