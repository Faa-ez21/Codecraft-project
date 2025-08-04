import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  // Allow only users in the `users` table (admins/staff)
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin' && user.role !== 'staff') return <Navigate to="/not-authorized" />;

  return children;
}
