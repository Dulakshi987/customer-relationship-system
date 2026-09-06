import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import '../styles/theme.css';

const initialForm = {
  firstName: '', lastName: '', email: '', gender: 'MALE',
  mobileNumber: '', address: '', feedback: '',
};

export default function Application() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/submissions', form);
      setSuccess('Form submitted successfully!');
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="brand-badge">
          <img src={logo} alt="Revotec" />
        </div>
        <div className="app-user">
          <span className="email">{user?.email}</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={logout}
            style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="app-body">
        <div className="app-intro">
          <div className="eyebrow-line" />
          <h1>Submit your details</h1>
          <p>Fill in the form below — every field marked is required.</p>
        </div>

        <div className="app-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="form-label">First name</label>
                <input
                  className="field"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  className="field"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="span-2">
                <label className="form-label">Email</label>
                <input
                  className="field"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Gender</label>
                <select className="field" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Mobile number</label>
                <input
                  className="field"
                  name="mobileNumber"
                  placeholder="e.g. 0771234567"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="span-2">
                <label className="form-label">Address</label>
                <input
                  className="field"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="span-2">
                <label className="form-label">Feedback (optional)</label>
                <textarea
                  className="field"
                  name="feedback"
                  placeholder="Anything you'd like to add"
                  value={form.feedback}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit'}
              </button>
              {error && <p className="msg-error" style={{ margin: 0 }}>{error}</p>}
              {success && <p className="msg-success" style={{ margin: 0 }}>{success}</p>}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
