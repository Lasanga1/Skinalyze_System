import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="leaf-pattern"></div>
        <div className="auth-header">
          <div className="flex justify-center mb-2">
            <h1 className="auth-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              Welcome Back
            </h1>
          </div>
          <p className="text-muted">Sign in to access your Skinalyze account.</p>
        </div>
        
        {error && <div className="mb-4 text-center text-danger" style={{fontSize: '0.9rem'}}>{error}</div>}

        <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 1 }}>
          <div className="form-group relative">
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group mt-4">
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="flex justify-end mb-4">
            <Link to="#" className="text-primary" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center" style={{ position: 'relative', zIndex: 1, fontSize: '0.9rem' }}>
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="text-primary" style={{ textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
          <div className="mt-3">
             <Link to="/admin/login" className="text-gray-400 hover:text-gray-600 transition-colors" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>Admin Access</Link>
          </div>
        </div>

        <div className="mt-4 text-center text-muted" style={{ position: 'relative', zIndex: 1, fontSize: '0.85rem' }}>
          Or sign in with:
          <div className="flex justify-center gap-4 mt-2">
            <button className="btn btn-outline" style={{width: '40px', height: '40px', padding: 0, borderRadius: '8px', fontWeight: 'bold'}}>G</button>
            <button className="btn btn-outline" style={{width: '40px', height: '40px', padding: 0, borderRadius: '8px', color: '#333', fontWeight: 'bold'}}></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
