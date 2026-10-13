import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Heart,
  Building2,
  User,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Search,
  ArrowLeft,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DatabaseDetailsModal from '../common/DatabaseDetailsModal';

export const DashboardLayout = ({ title, subtitle, children }) => {
  const { user, role, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [dbModalOpen, setDbModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'hospital':
        return <Building2 size={20} />;
      case 'blood_bank':
        return <Layers size={20} />;
      case 'donor':
        return <Heart size={20} />;
      case 'admin':
        return <ShieldCheck size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const roleDisplayNames = {
    patient: 'Patient / Requester',
    hospital: 'Hospital & Trauma Center',
    blood_bank: 'Blood Bank Hub',
    donor: 'Voluntary Donor',
    admin: 'System Administrator'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      {/* Top Dashboard Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            <ArrowLeft size={16} /> Home
          </Link>
          <div style={{ height: '20px', width: '1px', background: 'var(--border-light)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary-red)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getRoleIcon()}
            </div>
            <div>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>
                {roleDisplayNames[role] || 'Healthcare Dashboard'}
              </span>
            </div>
          </div>
        </div>

        {/* Presentation Role Switcher Demo Helper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="presentation-role-bar">
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>[Demo Testing]:</span>
            {['patient', 'hospital', 'blood_bank', 'donor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={async () => {
                  try {
                    await demoLogin(r);
                    navigate(`/dashboard/${r}`);
                  } catch (e) {
                    console.error('Demo auth failed:', e);
                  }
                }}
                className={`btn btn-sm ${role === r ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '3px 8px', height: '26px' }}
                title={`Switch demo role to ${r}`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
            {/* Live MySQL Database Quick View Button */}
            <button
              onClick={() => setDbModalOpen(true)}
              className="btn btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                padding: '3px 8px',
                height: '26px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#0F172A',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Inspect MySQL Database Details, Tables & Connection"
            >
              <Database size={13} color="#059669" />
              <span>MySQL 8.0</span>
            </button>
          </div>

          <div style={{ height: '20px', width: '1px', background: 'var(--border-light)' }} />

          {/* User profile & logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.fullName || 'Active User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.city || 'Mumbai'} • {user?.email}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline-red btn-sm"
              title="Sign Out"
              style={{ padding: '6px 10px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 0' }}>
        <div className="container">
          {/* Header Title Banner */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-red" style={{ textTransform: 'uppercase' }}>
                  {role?.replace('_', ' ')} PORTAL
                </span>
                <span className="badge badge-success">Live Network Connected</span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {title}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '2px' }}>
                {subtitle}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/find-blood" className="btn btn-secondary btn-sm">
                <Search size={15} /> Find Blood
              </Link>
              <Link to="/emergency-request" className="btn btn-emergency btn-sm">
                <AlertCircle size={15} /> Emergency Request
              </Link>
            </div>
          </div>

          {children}
        </div>
      </main>

      <DatabaseDetailsModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
