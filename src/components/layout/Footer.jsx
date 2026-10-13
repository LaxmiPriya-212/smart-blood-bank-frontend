import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Phone, ShieldCheck, Heart, MapPin, Database } from 'lucide-react';
import DatabaseDetailsModal from '../common/DatabaseDetailsModal';

export const Footer = () => {
  const [dbModalOpen, setDbModalOpen] = useState(false);
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>
              <Droplet size={22} fill="#FFFFFF" />
              Smart Blood Bank Network
            </h3>
            <p>
              A centralized, fault-tolerant B.Tech capstone project connecting Patients,
              Hospitals, Certified Blood Banks, and Voluntary Donors with automated
              proximity matching, barcode tracking, and emergency triage.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#10B981', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>National Cold-Chain & Compliance Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/find-blood">Find Available Blood</Link></li>
              <li><Link to="/emergency-request">Emergency SOS Request</Link></li>
              <li><Link to="/login">Role Dashboard Login</Link></li>
              <li><Link to="/register">Create New Account</Link></li>
            </ul>
          </div>

          {/* Role Portals */}
          <div className="footer-col">
            <h4>Role Portals</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard/patient">Patient Requisition</Link></li>
              <li><Link to="/dashboard/hospital">Hospital & Surgery Hub</Link></li>
              <li><Link to="/dashboard/blood_bank">Blood Bank Inventory</Link></li>
              <li><Link to="/dashboard/donor">Voluntary Donor Space</Link></li>
              <li><Link to="/dashboard/admin">System Administration</Link></li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div className="footer-col">
            <h4>24/7 National Emergency</h4>
            <div style={{ background: '#1E293B', padding: '14px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>
                <Phone size={16} /> Emergency Helpline
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                1800-BLOOD-SOS
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Or dial national trauma lines 104 / 108</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#EF4444" />
              <span>Regional Hubs: Mumbai • Pune • Delhi • Bangalore</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Smart Blood Bank Network • B.Tech Capstone Project</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setDbModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#34D399',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Inspect MySQL Database Details, Tables & Connection"
            >
              <Database size={13} color="#10B981" /> MySQL 8.0: Connected
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Built with <Heart size={14} color="#EF4444" fill="#EF4444" /> React + Vite + Node.js + MySQL
            </span>
          </div>
        </div>
      </div>

      <DatabaseDetailsModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </footer>
  );
};

export default Footer;
