import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import '../styles/theme.css';

export default function CustomerRegister() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registered successfully. Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <h2>Create your account</h2>
        <p className="sub">Register to start submitting your details.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="field"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="field"
            name="password"
            type="password"
            placeholder="Password (min 4 characters)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="field"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && <p className="msg-error">{error}</p>}
          {success && <p className="msg-success">{success}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
      </div>
      <Footer />
    </div>
  );
}
