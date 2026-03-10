import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope } from 'lucide-react';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.post('/register', { name, email, password });
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="leaf-pattern"></div>
        <div className="auth-header">
          <h1 className="auth-title">Join Skinalyze</h1>
          <p className="text-muted">Create an account to start tracking your skin health.</p>
        </div>
        
        {error && <div className="mb-4 text-center text-danger" style={{fontSize: '0.9rem'}}>{error}</div>}

        <form onSubmit={handleRegister} style={{ position: 'relative', zIndex: 1 }}>
          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="flex gap-2">
            <div className="form-group w-full">
              <input 
                type="password" 
                className="form-input" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-group w-full">
              <input 
                type="password" 
                className="form-input" 
                placeholder="Confirm" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary w-full justify-center mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center" style={{ position: 'relative', zIndex: 1, fontSize: '0.9rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-primary" style={{ textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
        </div>

        <div className="mt-2 text-center" style={{ position: 'relative', zIndex: 1, fontSize: '0.75rem' }}>
          <span className="text-muted">Terms of Service or Privacy Policy</span>
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

export default Register;
