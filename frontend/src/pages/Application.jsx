import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  firstName: '', lastName: '', email: '', gender: 'MALE',
  mobileNumber: '', address: '', feedback: '',
};

export default function Application() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/submissions', form);
      setSuccess('Form submitted successfully!');
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Application Form</h2>
        <button onClick={logout}>Logout ({user?.email})</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={inputStyle} />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input name="mobileNumber" placeholder="Mobile Number (e.g. 0771234567)" value={form.mobileNumber} onChange={handleChange} required style={inputStyle} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required style={inputStyle} />
        <textarea name="feedback" placeholder="Feedback (optional)" value={form.feedback} onChange={handleChange} style={{ ...inputStyle, height: 80 }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', marginBottom: 12, padding: 8 };
const buttonStyle = { padding: '8px 16px' };
