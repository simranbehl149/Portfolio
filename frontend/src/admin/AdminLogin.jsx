import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminEmail', response.data.admin.email);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h2>Admin <span>Login</span></h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--gray)' }}>Enter your credentials to access dashboard</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray)' }}>
          Default: admin@portfolio.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;