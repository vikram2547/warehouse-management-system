import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Transfers from './pages/Transfers';
import Invoices from './pages/Invoices';
import './App.css';

const AppContent = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>📦 Warehouse Management</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/transfers">Transfers</Link></li>
          <li><Link to="/invoices">Invoices</Link></li>
        </ul>
        <div className="user-menu">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </main>
    </div>
  );
};

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Warehouse Management System</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
