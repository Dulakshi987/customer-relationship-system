import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Guards a route by required role: <ProtectedRoute role="ADMIN"><AdminDashboard/></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
