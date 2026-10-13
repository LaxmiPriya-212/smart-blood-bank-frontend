import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, AlertCircle, User, LogOut, Menu, X, LayoutDashboard, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DatabaseDetailsModal from '../common/DatabaseDetailsModal';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Droplet size={26} fill="#FFFFFF" />
          </div>
          <div className="brand-name">
            Smart Blood Bank
            <span>Emergency Network</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/find-blood" className={`nav-link ${isActive('/find-blood') ? 'active' : ''}`}>
                Find Blood
              </Link>
            </li>
            <li>
              <Link to="/emergency-request" className={`nav-link ${isActive('/emergency-request') ? 'active' : ''}`}>
                Emergency SOS
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to={`/dashboard/${user.role}`}
                  className={`nav-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Live MySQL Database Quick View Button */}
          <button
            onClick={() => setDbModalOpen(true)}
            className="btn btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="View MySQL Database Architecture, Tables & Setup Details"
          >
            <Database size={14} color="#059669" />
            <span>MySQL: 8.0</span>
          </button>

          <Link to="/emergency-request" className="btn btn-emergency btn-sm">
            <AlertCircle size={15} />
            <span>Emergency Request</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={`/dashboard/${user.role}`}
                className="btn btn-secondary btn-sm"
                title="Open Role Dashboard"
              >
                <User size={15} />
                <span>{user.fullName?.split(' ')[0] || user.role}</span>
                <span className="badge badge-red" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline-red btn-sm"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <User size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="mobile-toggle-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              padding: '6px'
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border-light)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}
          >
            Home
          </Link>
          <Link
            to="/find-blood"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}
          >
            Find Blood
          </Link>
          <Link
            to="/emergency-request"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--primary-red)', padding: '6px 0' }}
          >
            Emergency Request
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setDbModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
          >
            <Database size={15} color="#059669" /> MySQL Database Details
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to={`/dashboard/${user.role}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-outline-red btn-sm"
                style={{ width: '100%', marginTop: '6px' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>

    <DatabaseDetailsModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </>
  );
};

export default Navbar;
