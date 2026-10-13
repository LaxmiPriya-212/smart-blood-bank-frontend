import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Droplet,
  Search,
  AlertCircle,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const COMPATIBILITY_DATA = {
  'O-': {
    give: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receive: ['O-'],
    note: 'Universal Red Blood Cell Donor. Highly vital in trauma emergencies when patient blood type is unknown.'
  },
  'O+': {
    give: ['O+', 'A+', 'B+', 'AB+'],
    receive: ['O+', 'O-'],
    note: 'Most common blood group. High demand across all general and surgical hospital procedures.'
  },
  'A-': {
    give: ['A-', 'A+', 'AB-', 'AB+'],
    receive: ['A-', 'O-'],
    note: 'Rare negative group. Essential for neonatal and pediatric emergency transfusions.'
  },
  'A+': {
    give: ['A+', 'AB+'],
    receive: ['A+', 'A-', 'O+', 'O-'],
    note: 'Second most frequent blood type in emergency hospital reserves.'
  },
  'B-': {
    give: ['B-', 'B+', 'AB-', 'AB+'],
    receive: ['B-', 'O-'],
    note: 'Rare blood type. High regional necessity for sickle-cell and oncology patients.'
  },
  'B+': {
    give: ['B+', 'AB+'],
    receive: ['B+', 'B-', 'O+', 'O-'],
    note: 'Extremely vital for ongoing trauma and leukemia platelet therapies.'
  },
  'AB-': {
    give: ['AB-', 'AB+'],
    receive: ['AB-', 'A-', 'B-', 'O-'],
    note: 'Rarest blood group among the population (< 1%). High plasma donation value.'
  },
  'AB+': {
    give: ['AB+'],
    receive: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    note: 'Universal Red Cell Recipient. Can receive packed red cells from any donor group.'
  }
};

const INITIAL_INVENTORY = [
  { group: 'O-', units: 4, status: 'Critical Low', percent: 20, color: 'critical' },
  { group: 'O+', units: 48, status: 'Available', percent: 85, color: 'normal' },
  { group: 'A-', units: 8, status: 'Low Stock', percent: 35, color: 'critical' },
  { group: 'A+', units: 36, status: 'Available', percent: 75, color: 'normal' },
  { group: 'B-', units: 6, status: 'Low Stock', percent: 28, color: 'critical' },
  { group: 'B+', units: 42, status: 'Available', percent: 80, color: 'normal' },
  { group: 'AB-', units: 3, status: 'Critical Low', percent: 18, color: 'critical' },
  { group: 'AB+', units: 21, status: 'Available', percent: 65, color: 'normal' }
];

export const Home = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const [searchGroup, setSearchGroup] = useState('O-');
  const [searchComponent, setSearchComponent] = useState('whole_blood');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCompatGroup, setSelectedCompatGroup] = useState('O-');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/find-blood?bloodGroup=${searchGroup}&componentType=${searchComponent}&city=${encodeURIComponent(searchCity)}`);
  };

  const handleLaunchRole = async (roleKey) => {
    try {
      await demoLogin(roleKey);
      navigate(`/dashboard/${roleKey}`);
    } catch (err) {
      console.error('Role launch error:', err);
      navigate('/login');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-pill">
            <span className="badge badge-red">
              <Sparkles size={14} /> Centralized Healthcare & Emergency Dispatch
            </span>
          </div>

          <h1 className="hero-title">
            Every Drop Counts. <span className="highlight-red">Real-Time Blood Search</span> & Immediate Hospital Dispatch
          </h1>

          <p className="hero-subtitle">
            Connecting Patients, Hospitals, Certified Blood Banks, and Voluntary Donors with
            automated proximity matching, live inventory tracking, and urgent triage routing.
          </p>

          {/* Quick Search Widget */}
          <div className="search-box-card">
            <div className="search-box-header">
              <div className="search-box-title">
                <Search size={20} color="#8B0000" />
                Live Blood Availability Finder
              </div>
              <span className="badge badge-success">Live Network Connected</span>
            </div>

            <form onSubmit={handleHeroSearch} className="search-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="hero-blood-group">Blood Group</label>
                <select
                  id="hero-blood-group"
                  className="form-control"
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hero-component-type">Component Type</label>
                <select
                  id="hero-component-type"
                  className="form-control"
                  value={searchComponent}
                  onChange={(e) => setSearchComponent(e.target.value)}
                >
                  <option value="whole_blood">Whole Blood</option>
                  <option value="packed_rbc">Packed RBCs</option>
                  <option value="platelets">Platelets (SDP/RDP)</option>
                  <option value="fresh_frozen_plasma">Fresh Frozen Plasma</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hero-city-input">City or District</label>
                <input
                  id="hero-city-input"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mumbai, Pune, Delhi..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Search size={18} />
                Find Available Units
              </button>
            </form>
          </div>

          {/* Hero Statistics Strip */}
          <div className="hero-stats-strip">
            <div className="stat-item">
              <div className="stat-number">48+</div>
              <div className="stat-label">Certified Blood Banks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2,450+</div>
              <div className="stat-label">Units in Storage</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">14.8 Min</div>
              <div className="stat-label">Avg Response Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.8%</div>
              <div className="stat-label">Critical Fulfillment</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOS Emergency Callout Banner */}
      <section className="container">
        <div className="sos-banner">
          <div className="sos-content">
            <div className="sos-tag">
              <AlertCircle size={14} /> Immediate Emergency Triage
            </div>
            <h2 className="sos-title">Facing an Acute Trauma or Surgical Blood Shortage?</h2>
            <p className="sos-desc">
              Raise a high-priority emergency requisition to trigger multi-bank automated reservation
              and notify nearby verified donors for fast-track dispatch.
            </p>
          </div>

          <div className="sos-actions">
            <div className="sos-hotline">
              <span className="sos-hotline-label">24/7 Emergency Dispatch</span>
              <span className="sos-hotline-num">1800-BLOOD-SOS</span>
            </div>
            <Link to="/emergency-request" className="btn btn-secondary btn-lg">
              <AlertCircle size={18} color="#8B0000" />
              Raise SOS Request
            </Link>
          </div>
        </div>
      </section>

      {/* Live Blood Inventory Overview */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <span className="badge badge-red">Network Supply Status</span>
            </div>
            <h2 className="section-title">Live Blood Stock Across Regional Hubs</h2>
            <p className="section-subtitle">
              Updated in real-time from cold-storage refrigerators and testing nodes.
            </p>
          </div>

          <div className="inventory-grid">
            {INITIAL_INVENTORY.map((item) => (
              <div key={item.group} className="blood-card">
                <div className="blood-card-top">
                  <div className="blood-badge-icon">{item.group}</div>
                  <span
                    className={`blood-status-tag ${
                      item.color === 'critical' ? 'badge-danger' : 'badge-success'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="blood-card-body">
                  <div className="units-count">
                    {item.units} <span>Units Ready</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${item.color === 'critical' ? 'critical' : ''}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>

                <div className="blood-card-footer">
                  <span>Temp: 4.0°C Verified</span>
                  <Link
                    to={`/find-blood?bloodGroup=${item.group}`}
                    className="btn btn-outline-red btn-sm"
                  >
                    Locate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Blood Compatibility Matrix */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <span className="badge badge-red">Clinical Guide</span>
            </div>
            <h2 className="section-title">Interactive Blood Compatibility Matrix</h2>
            <p className="section-subtitle">
              Select any blood group below to instantly evaluate transfusion compatibility for donor and recipient safety.
            </p>
          </div>

          <div className="compatibility-box">
            <div className="blood-selector-tabs">
              {Object.keys(COMPATIBILITY_DATA).map((bg) => (
                <button
                  key={bg}
                  className={`blood-tab-btn ${selectedCompatGroup === bg ? 'active' : ''}`}
                  onClick={() => setSelectedCompatGroup(bg)}
                >
                  {bg}
                </button>
              ))}
            </div>

            <div className="compatibility-result-grid">
              <div className="compat-card">
                <div className="compat-card-title">
                  <ArrowRight size={20} color="#1D4ED8" />
                  <span>Can Give Red Blood Cells To:</span>
                </div>
                <div className="compat-badges-row">
                  {COMPATIBILITY_DATA[selectedCompatGroup].give.map((g) => (
                    <span key={g} className="compat-pill compat-pill-give">{g}</span>
                  ))}
                </div>
              </div>

              <div className="compat-card">
                <div className="compat-card-title">
                  <CheckCircle2 size={20} color="#047857" />
                  <span>Can Receive Red Blood Cells From:</span>
                </div>
                <div className="compat-badges-row">
                  {COMPATIBILITY_DATA[selectedCompatGroup].receive.map((r) => (
                    <span key={r} className="compat-pill compat-pill-receive">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--accent-rose)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-rose-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Info size={20} color="#8B0000" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--primary-red)' }}>Clinical Fact for {selectedCompatGroup}: </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{COMPATIBILITY_DATA[selectedCompatGroup].note}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals Showcase */}
      <section className="section-padding roles-section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <span className="badge badge-red">System Architecture</span>
            </div>
            <h2 className="section-title">5 Unified Role-Based Dashboards</h2>
            <p className="section-subtitle">
              Engineered with dedicated workflows for every stakeholder in the healthcare supply chain.
            </p>
          </div>

          <div className="roles-grid">
            {/* 1. Patient */}
            <div className="role-card">
              <div>
                <div className="role-icon-box"><User size={24} /></div>
                <h3 className="role-name">1. Patient / Requester</h3>
                <p className="role-desc">Instant search, track emergency requests, upload doctor prescriptions, and live status.</p>
                <ul className="role-features-list">
                  <li>Emergency blood tickets</li>
                  <li>Real-time status tracking</li>
                  <li>Doctor prescription upload</li>
                  <li>Hospital pick-up pass</li>
                </ul>
              </div>
              <button onClick={() => handleLaunchRole('patient')} className="btn btn-outline-red btn-sm">
                Open Patient Portal
              </button>
            </div>

            {/* 2. Hospital */}
            <div className="role-card">
              <div>
                <div className="role-icon-box"><Building2 size={24} /></div>
                <h3 className="role-name">2. Hospital & ICU</h3>
                <p className="role-desc">Bulk surgery reservations, emergency requisitions, bed ward allocation, and doctor nodal approval.</p>
                <ul className="role-features-list">
                  <li>Bulk surgery requisitions</li>
                  <li>Doctor nodal authorization</li>
                  <li>Cross-matching requests</li>
                  <li>Priority cold-chain delivery</li>
                </ul>
              </div>
              <button onClick={() => handleLaunchRole('hospital')} className="btn btn-outline-red btn-sm">
                Open Hospital Portal
              </button>
            </div>

            {/* 3. Blood Bank */}
            <div className="role-card">
              <div>
                <div className="role-icon-box"><Layers size={24} /></div>
                <h3 className="role-name">3. Blood Bank Hub</h3>
                <p className="role-desc">Batch inventory logs, automated expiry engine, reservation lock, and QR dispatch validation.</p>
                <ul className="role-features-list">
                  <li>Batch inventory logs</li>
                  <li>Expiry date alert engine</li>
                  <li>Reservation & issuing</li>
                  <li>Barcode verification</li>
                </ul>
              </div>
              <button onClick={() => handleLaunchRole('blood_bank')} className="btn btn-outline-red btn-sm">
                Open Bank Portal
              </button>
            </div>

            {/* 4. Donor */}
            <div className="role-card">
              <div>
                <div className="role-icon-box"><Heart size={24} /></div>
                <h3 className="role-name">4. Voluntary Donor</h3>
                <p className="role-desc">Eligibility self-test, nearest blood camp locator, slot scheduling, and digital life-saver badges.</p>
                <ul className="role-features-list">
                  <li>90-Day eligibility check</li>
                  <li>Camp appointments</li>
                  <li>Digital certificate wallet</li>
                  <li>Emergency donor alerts</li>
                </ul>
              </div>
              <button onClick={() => handleLaunchRole('donor')} className="btn btn-outline-red btn-sm">
                Open Donor Portal
              </button>
            </div>

            {/* 5. Admin */}
            <div className="role-card">
              <div>
                <div className="role-icon-box"><ShieldCheck size={24} /></div>
                <h3 className="role-name">5. System Admin</h3>
                <p className="role-desc">Supervise connected nodes, verify regulatory licenses, audit logs, and regional redistribution.</p>
                <ul className="role-features-list">
                  <li>City-wide analytics charts</li>
                  <li>Facility accreditation</li>
                  <li>Immutable audit logs</li>
                  <li>Redistribution alerts</li>
                </ul>
              </div>
              <button onClick={() => handleLaunchRole('admin')} className="btn btn-outline-red btn-sm">
                Open Admin Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <span className="badge badge-red">Streamlined Process</span>
            </div>
            <h2 className="section-title">End-to-End Life Saving Workflow</h2>
            <p className="section-subtitle">From bedside requisition to temperature-controlled hospital transfusion.</p>
          </div>

          <div className="workflow-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">1. Search or SOS Ticket</h3>
              <p className="step-desc">Requester inputs required blood group, component, units, and destination hospital.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">2. Proximity Matching</h3>
              <p className="step-desc">The network algorithm checks real-time stock across certified banks in closest radius.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">3. Reservation & Verify</h3>
              <p className="step-desc">The designated bank locks the units, preventing double-allocation and testing batches.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">4. Dispatch & Life Saved</h3>
              <p className="step-desc">Cold-chain transport delivers units to hospital with barcode sign-off and audit logging.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
