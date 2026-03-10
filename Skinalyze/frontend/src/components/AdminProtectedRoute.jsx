import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/admin/login" />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      // If a regular user tries to access admin, send them to home
      return <Navigate to="/" />;
    }
  } catch (err) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtectedRoute;
