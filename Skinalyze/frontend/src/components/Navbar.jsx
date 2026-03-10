import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Microscope, User } from 'lucide-react';
import api from '../api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
       try {
           const res = await api.get('/me');
           setUserName(res.data.name || 'Account');
       } catch (err) {
           console.error('Failed to fetch user', err);
       }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const nameInitial = userName && userName !== 'Account' ? userName.charAt(0).toUpperCase() : <User size={18} />;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <Microscope className="text-primary" size={28} />
        <span>Skinalyze</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/analyze" className={`nav-link ${location.pathname === '/analyze' ? 'active' : ''}`}>Analyze</Link>
        <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>History</Link>
        <Link to="/progress" className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}>Progress</Link>
        <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}>Support</Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="nav-user">
          <div className="avatar">
            {nameInitial}
          </div>
          <span>{userName || 'Account'}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
