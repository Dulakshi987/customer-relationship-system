import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import '../styles/theme.css';

export default function Home() {
  return (
    <div className="home-shell">
      <nav className="home-nav">
        <div className="brand-badge">
          <img src={logo} alt="Revotec" />
        </div>
        <div className="home-nav-links">
          <Link to="/login">Customer Login</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-copy">
          <div className="eyebrow-line" />
          <h1>One form, submitted once, tracked properly.</h1>
          <p>
            Revotec's submission portal lets customers register and send in
            their details securely, while admins review, filter, and manage
            every record from a single dashboard.
          </p>
          <div className="home-actions">
            <Link to="/register" className="btn btn-primary">Create an account</Link>
            <Link to="/login" className="btn btn-secondary">Sign in</Link>
          </div>
        </div>

        <div className="card-stack" aria-hidden="true">
          <div className="stack-card c1">
            <div className="line" style={{ width: '70%' }} />
            <div className="line short" />
            <span className="tag tag-violet">Pending</span>
          </div>
          <div className="stack-card c2">
            <div className="line" style={{ width: '55%' }} />
            <div className="line short" />
            <span className="tag tag-violet">Reviewed</span>
          </div>
          <div className="stack-card c3">
            <div className="line" style={{ width: '80%' }} />
            <div className="line short" />
            <span className="tag tag-ink">Submitted</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
