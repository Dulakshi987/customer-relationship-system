import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function CustomerRegister() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Customer Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password (min 4 chars)" value={form.password} onChange={handleChange} required style={inputStyle} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', marginBottom: 12, padding: 8 };
const buttonStyle = { padding: '8px 16px' };
