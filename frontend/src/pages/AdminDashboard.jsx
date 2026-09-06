import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import '../styles/theme.css';

const GENDER_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState('');
  const [createdAdmin, setCreatedAdmin] = useState(null);

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

  function openAddAdmin() {
    setNewAdminEmail('');
    setAddAdminError('');
    setCreatedAdmin(null);
    setShowAddAdmin(true);
  }

  function closeAddAdmin() {
    setShowAddAdmin(false);
  }

  async function handleCreateAdmin(e) {
    e.preventDefault();
    setAddAdminError('');
    setAddAdminLoading(true);
    try {
      const res = await api.post('/auth/admin/create', { email: newAdminEmail });
      setCreatedAdmin({
        email: res.data.admin?.email || newAdminEmail,
        password: res.data.generatedPassword,
      });
    } catch (err) {
      setAddAdminError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setAddAdminLoading(false);
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="brand-badge">
          <img src={logo} alt="Revotec" />
        </div>
        <div className="admin-user">
          <span className="email">{user?.email}</span>
          <button className="btn btn-secondary btn-sm" onClick={openAddAdmin} style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
            + Add admin
          </button>
          <button className="btn btn-secondary btn-sm" onClick={logout} style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-body">
        <div className="admin-header-row">
          <h1>Submissions</h1>
          <span className="admin-count">{submissions.length} total</span>
        </div>

        <div className="toolbar">
          <input
            className="field"
            placeholder="Search by first or last name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="segmented">
            {GENDER_FILTERS.map((f) => (
              <button
                key={f.value}
                className={gender === f.value ? 'active' : ''}
                onClick={() => setGender(f.value)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="msg-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className={editingId === sub.id ? 'editing' : ''}>
                  {editingId === sub.id ? (
                    <>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            className="field field-sm"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            style={{ width: 80 }}
                          />
                          <input
                            className="field field-sm"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            style={{ width: 80 }}
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          className="field field-sm"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="field field-sm"
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="field field-sm"
                          value={editForm.mobileNumber}
                          onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="field field-sm"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="field field-sm"
                          value={editForm.feedback || ''}
                          onChange={(e) => setEditForm({ ...editForm, feedback: e.target.value })}
                        />
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => saveEdit(sub.id)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{sub.firstName} {sub.lastName}</td>
                      <td>{sub.email}</td>
                      <td><span className="gender-pill">{sub.gender}</span></td>
                      <td>{sub.mobileNumber}</td>
                      <td>{sub.address}</td>
                      <td>{sub.feedback}</td>
                      <td>
                        <div className="row-actions">
                          <button className="btn-text" onClick={() => startEdit(sub)}>Edit</button>
                          <button className="btn-text danger" onClick={() => handleDelete(sub.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">No submissions match your filters yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddAdmin && (
        <div className="modal-overlay" onClick={closeAddAdmin}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {!createdAdmin ? (
              <>
                <h3>Add a new admin</h3>
                <p className="sub">
                  A random password is generated automatically and shown once below.
                </p>
                <form onSubmit={handleCreateAdmin}>
                  <input
                    className="field"
                    type="email"
                    placeholder="New admin's email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                  />
                  {addAdminError && <p className="msg-error">{addAdminError}</p>}
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeAddAdmin}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={addAdminLoading}>
                      {addAdminLoading ? 'Creating…' : 'Create admin'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>Admin created</h3>
                <p className="sub">
                  Share this password with the new admin now — it won't be shown again.
                </p>
                <div className="credential-box">
                  <div><span className="cred-label">Email</span>{createdAdmin.email}</div>
                  <div><span className="cred-label">Password</span>{createdAdmin.password}</div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-primary" onClick={closeAddAdmin}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
