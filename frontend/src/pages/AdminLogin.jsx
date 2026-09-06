import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/admin/login', form);
      login(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', marginBottom: 12, padding: 8 };
const buttonStyle = { padding: '8px 16px' };
