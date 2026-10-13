import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Droplet,
  User,
  Building2,
  Layers,
  Heart,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin, loading } = useAuth();

  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('sneha.patient@gmail.com');
  const [password, setPassword] = useState('Password@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoNotice, setInfoNotice] = useState('Pre-filled with Patient demo account for testing.');

  const rolesList = [
    { id: 'patient', label: 'Patient', icon: <User size={16} /> },
    { id: 'hospital', label: 'Hospital', icon: <Building2 size={16} /> },
    { id: 'blood_bank', label: 'Blood Bank', icon: <Layers size={16} /> },
    { id: 'donor', label: 'Donor', icon: <Heart size={16} /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck size={16} /> }
  ];

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = DEMO_ACCOUNTS[roleKey];
    if (demo) {
      setEmail(demo.email);
      setPassword('Password@123');
      setInfoNotice(`Switched to ${demo.fullName} (${demo.role.toUpperCase()}) demo credentials.`);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    try {
      const res = await login(email, password);
      const destinationRole = res.user?.role || selectedRole;
      const redirectPath = location.state?.from?.pathname || `/dashboard/${destinationRole}`;
      navigate(redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials or use demo autofill.');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '60px 24px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 32px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--primary-red) 0%, var(--primary-red-dark) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)'
                }}
              >
                <Droplet size={30} fill="#FFFFFF" />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Sign In to Network
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Access verified healthcare portal with role authorization
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                Select Your Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`btn btn-sm ${selectedRole === r.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.72rem',
                      padding: '8px 2px',
                      flexDirection: 'column',
                      gap: '4px',
                      height: 'auto'
                    }}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alert / Info Message */}
            {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}
            {infoNotice && !errorMsg && (
              <div
                style={{
                  background: 'var(--accent-rose)',
                  border: '1px solid var(--accent-rose-border)',
                  color: 'var(--primary-red)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} />
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="var(--text-light)"
                    style={{ position: 'absolute', left: '12px', top: '13px' }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setInfoNotice('');
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Demo: <strong>Password@123</strong>
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="var(--text-light)"
                    style={{ position: 'absolute', left: '12px', top: '13px' }}
                  />
                  <input
                    id="login-password"
                    type="password"
                    required
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {loading ? 'Authenticating...' : `Sign In as ${selectedRole.replace('_', ' ').toUpperCase()}`}
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Don't have an account yet?{' '}
                <Link to="/register" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
