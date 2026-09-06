import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CustomerLogin() {
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
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/application');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', marginBottom: 12, padding: 8 };
const buttonStyle = { padding: '8px 16px' };
