import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, FileText, Activity, LogOut, Pill, Users, ListFilter } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Conditions', path: '/admin/conditions', icon: <Activity size={20} /> },
    { name: 'Remedies', path: '/admin/remedies', icon: <Pill size={20} /> },
    { name: 'Ingredients', path: '/admin/ingredients', icon: <ListFilter size={20} /> },
    { name: 'Doctors', path: '/admin/doctors', icon: <Stethoscope size={20} /> },
    { name: 'Analyses', path: '/admin/analysis', icon: <FileText size={20} /> },
    { name: 'Feedback', path: '/admin/feedback', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-72 admin-sidebar flex flex-col h-screen fixed z-10 shadow-2xl">
      <div className="p-8 pb-6">
        <h2 className="text-2xl admin-header-title text-center mb-2">
          Skinalyze Admin
        </h2>
        <div className="flex items-center space-x-3 mt-6 p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg">
             {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
           </div>
           <div>
             <p className="text-white text-sm font-semibold leading-tight">{user?.name || 'Admin User'}</p>
             <p className="text-blue-300 text-xs mt-0.5">Online</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-2 px-6 font-medium">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-4">Menu Controls</p>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`admin-sidebar-link flex items-center space-x-4 py-3.5 px-5 rounded-2xl ${isActive ? 'active shadow-lg shadow-blue-500/10' : ''}`}
              >
                <div className={`${isActive ? 'text-blue-400 drop-shadow-md' : 'text-slate-400 opacity-80'}`}>
                  {link.icon}
                </div>
                <span className="tracking-wide">{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-white/5 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-white/5 hover:border-red-500/30 rounded-xl transition-all font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
