import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  async function fetchSubmissions() {
    setError('');
    try {
      const params = {};
      if (gender) params.gender = gender;
      if (search) params.search = search;
      const res = await api.get('/submissions', { params });
      setSubmissions(res.data.submissions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    }
  }

  useEffect(() => { fetchSubmissions(); }, [gender, search]);

  async function handleDelete(id) {
    if (!confirm('Delete this submission?')) return;
    try {
      await api.delete(`/submissions/${id}`);
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  }

  function startEdit(sub) {
    setEditingId(sub.id);
    setEditForm(sub);
  }

  async function saveEdit(id) {
    try {
      await api.put(`/submissions/${id}`, editForm);
      setEditingId(null);
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout ({user?.email})</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Search by first/last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: 8 }}>
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Gender</th><th>Mobile</th><th>Address</th><th>Feedback</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              {editingId === sub.id ? (
                <>
                  <td>
                    <input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} style={{ width: 60 }} />
                    <input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} style={{ width: 60 }} />
                  </td>
                  <td><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                  <td>
                    <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </td>
                  <td><input value={editForm.mobileNumber} onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })} /></td>
                  <td><input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} /></td>
                  <td><input value={editForm.feedback || ''} onChange={(e) => setEditForm({ ...editForm, feedback: e.target.value })} /></td>
                  <td>
                    <button onClick={() => saveEdit(sub.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{sub.firstName} {sub.lastName}</td>
                  <td>{sub.email}</td>
                  <td>{sub.gender}</td>
                  <td>{sub.mobileNumber}</td>
                  <td>{sub.address}</td>
                  <td>{sub.feedback}</td>
                  <td>
                    <button onClick={() => startEdit(sub)}>Edit</button>
                    <button onClick={() => handleDelete(sub.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
