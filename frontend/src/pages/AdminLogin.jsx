import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import '../styles/theme.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', form);
      login(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-center">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-badge lg">
            <img src={logo} alt="Revotec" />
          </div>
        </div>
        <h2>Admin sign in</h2>
        <p className="sub">Restricted to admin accounts only.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="field"
            name="email"
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="field"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p className="msg-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-foot"><Link to="/">← Back to home</Link></p>
      </div>
      </div>
      <Footer />
    </div>
  );
}
