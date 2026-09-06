import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

import Home from './pages/Home';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import Application from './pages/Application';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/application"
            element={<ProtectedRoute role="CUSTOMER"><Application /></ProtectedRoute>}
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
