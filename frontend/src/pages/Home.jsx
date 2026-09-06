import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Form Management System</h1>
      <p>Submit and manage customer information securely.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <Link to="/register">Customer Register</Link>
        <Link to="/login">Customer Login</Link>
        <Link to="/admin/login">Admin Login</Link>
      </div>
    </div>
  );
}
