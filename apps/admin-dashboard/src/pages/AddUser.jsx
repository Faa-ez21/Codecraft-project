import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [],
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (permission) => {
    setFormData(prev => {
      const updated = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, role, permissions } = formData;

    const { data, error } = await supabase.from('users').insert([
      {
        name,
        email,
        role,
        permissions, // stored as a JSON array in Supabase
        status: 'Active',
        last_active: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error adding user:', error.message);
      alert('Failed to add user');
    } else {
      navigate('/users'); // redirect to Users list
    }
  };

  const permissionOptions = [
    'Manage Products',
    'Manage Orders',
    'Manage Customers',
    'Manage Team',
    
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Team Member</h1>
      <form className="max-w-md space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            required
          >
            <option value="">Select role</option>
            <option value="Admin">Warehouse</option>
            <option value="Admin">Sales</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mt-4">Permissions</label>
          <div className="space-y-2 mt-2">
            {permissionOptions.map((perm) => (
              <label key={perm} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm)}
                  onChange={() => handleCheckboxChange(perm)}
                />
                {perm}
              </label>
            ))}
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
