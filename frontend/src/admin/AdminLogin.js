import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await axios.post(`${API_BASE_URL}/api/admin/login`, { username, password });
      setMessage(res.data.message);
      if (res.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8ffae' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(60,60,120,0.10)', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', color: '#2d3a4a' }}>Admin Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem' }} />
        <div style={{ position: 'relative', width: '320px', margin: '0 auto' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: '0.7rem 2.5rem 0.7rem 0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
          />
          <span
            onClick={() => setShowPassword(s => !s)}
            style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: '1.2rem', userSelect: 'none' }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#191654" strokeWidth="2" d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="3" stroke="#191654" strokeWidth="2"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#191654" strokeWidth="2" d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="3" stroke="#191654" strokeWidth="2"/><line x1="4" y1="4" x2="20" y2="20" stroke="#e74c3c" strokeWidth="2"/></svg>
            )}
          </span>
        </div>
        <button type="submit" style={{ background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)', color: '#fff', border: 'none', borderRadius: '2rem', padding: '0.8rem 2.2rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)', transition: 'transform 0.2s' }}>Login</button>
        <p style={{ textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>{message}</p>
      </form>
    </div>
  );
}

export default AdminLogin;
