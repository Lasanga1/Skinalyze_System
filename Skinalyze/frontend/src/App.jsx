import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Normal Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Result from './pages/Result';
import History from './pages/History';
import Progress from './pages/Progress';
import DoctorSupport from './pages/DoctorSupport';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageConditions from './pages/admin/ManageConditions';
import ManageRemedies from './pages/admin/ManageRemedies';
import ManageIngredients from './pages/admin/ManageIngredients';
import ManageDoctors from './pages/admin/ManageDoctors';
import ViewFeedback from './pages/admin/ViewFeedback';
import ViewAnalysis from './pages/admin/ViewAnalysis';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    {children}
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen admin-bg">
    <AdminNavbar />
    <div className="flex-1 ml-72 p-6 lg:p-10 admin-fade-in flex justify-center">
      <div className="w-full max-w-7xl">
        {children}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/conditions" element={<AdminProtectedRoute><AdminLayout><ManageConditions /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/remedies" element={<AdminProtectedRoute><AdminLayout><ManageRemedies /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/ingredients" element={<AdminProtectedRoute><AdminLayout><ManageIngredients /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/doctors" element={<AdminProtectedRoute><AdminLayout><ManageDoctors /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/feedback" element={<AdminProtectedRoute><AdminLayout><ViewFeedback /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/analysis" element={<AdminProtectedRoute><AdminLayout><ViewAnalysis /></AdminLayout></AdminProtectedRoute>} />

        {/* NORMAL USER ROUTES */}
        <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/analyze" element={<ProtectedRoute><AppLayout><Analyze /></AppLayout></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><AppLayout><Result /></AppLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><AppLayout><DoctorSupport /></AppLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
