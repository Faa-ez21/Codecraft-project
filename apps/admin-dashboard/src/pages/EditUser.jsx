import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    permissions: {
      manageProducts: false,
      manageOrders: false,
      manageCustomers: false,
      manageTeam: false,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUserData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || '',
          permissions: data.permissions || {},
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, role, permissions } = userData;

    const { error } = await supabase
      .from('users')
      .update({ name, email, phone, role, permissions })
      .eq('id', id);

    if (error) {
      alert('Failed to update user: ' + error.message);
    } else {
      alert('User updated successfully!');
      navigate('/users');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Admin</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="tel"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          name="role"
          value={userData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full border border-gray-300 rounded p-2"
        />

        <div className="space-y-2">
          <label className="block font-medium">Permissions</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="manageProducts"
              checked={userData.permissions.manageProducts || false}
              onChange={handlePermissionChange}
            />
            Manage Products
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="manageOrders"
              checked={userData.permissions.manageOrders || false}
              onChange={handlePermissionChange}
            />
            Manage Orders
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="manageCustomers"
              checked={userData.permissions.manageCustomers || false}
              onChange={handlePermissionChange}
            />
            Manage Customers
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="manageTeam"
              checked={userData.permissions.manageTeam || false}
              onChange={handlePermissionChange}
            />
            Manage Team
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
