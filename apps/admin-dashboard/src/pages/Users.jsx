import React from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
  const users = [
    {
      name: 'Aisha Mensah',
      email: 'aisha.mensah@comfortzone.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 days ago',
    },
    {
      name: 'Kwame Boateng',
      email: 'kwame.boateng@comfortzone.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '1 week ago',
    },
    {
      name: 'Nana Akua',
      email: 'nana.akua@comfortzone.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '3 days ago',
    },
    {
      name: 'Yaw Asante',
      email: 'yaw.asante@comfortzone.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '1 week ago',
    },
    {
      name: 'Ama Serwaa',
      email: 'ama.serwaa@comfortzone.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 days ago',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">User Management</h1>
      <p className="text-sm text-gray-600 mb-6">Manage your team members and their roles</p>

      <h2 className="text-xl font-medium mb-4">Admins</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="p-4">{user.name}</td>
                <td className="p-4 text-green-700">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4 text-green-600">{user.status}</td>
                <td className="p-4">{user.lastActive}</td>
                <td className="p-4">
                  <Link
                    to={`/edit-user/${i}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          to="/add-user"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Add Team Member
        </Link>
        <Link
          to="/admin-roles"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm"
        >
          View Admin Roles
        </Link>
      </div>
    </div>
  );
};

export default Users;
