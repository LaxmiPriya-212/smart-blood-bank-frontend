import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  User,
  Building2,
  Layers,
  Heart,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    address: '',
    // Role-specific fields
    bloodGroup: 'O+',
    dob: '1998-05-15',
    gender: 'male',
    weightKg: 65,
    hospitalRegCode: '',
    nodalOfficerName: '',
    bankLicenseNumber: '',
    storageCapacity: 500
  });

  const [errorMsg, setErrorMsg] = useState('');

  const roles = [
    { id: 'patient', label: 'Patient / Requester', icon: <User size={16} /> },
    { id: 'donor', label: 'Voluntary Donor', icon: <Heart size={16} /> },
    { id: 'hospital', label: 'Hospital Facility', icon: <Building2 size={16} /> },
    { id: 'blood_bank', label: 'Blood Bank Hub', icon: <Layers size={16} /> }
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    try {
      const payload = {
        ...formData,
        role
      };
      const res = await register(payload);
      navigate(`/dashboard/${role}`);
    } catch (err) {
      setErrorMsg(err.message || 'Registration encountered an error. Please review the form fields.');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '50px 24px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--primary-red) 0%, var(--primary-red-dark) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)'
                }}
              >
                <Droplet size={28} fill="#FFFFFF" />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Register on Blood Network
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
                Join the verified healthcare grid to request, store, or donate life-saving blood
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                Select Registration Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`btn btn-sm ${role === r.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.78rem',
                      padding: '10px 4px',
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

            {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

            <form onSubmit={handleSubmit}>
              {/* Primary Identity Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    {role === 'hospital'
                      ? 'Hospital / Clinic Legal Name'
                      : role === 'blood_bank'
                      ? 'Blood Bank Entity Name'
                      : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={role === 'hospital' ? 'e.g. Lilavati Hospital' : 'e.g. Rohan Mehta'}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Create Password</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                  />
                </div>
              </div>

              {/* Role-Specific Custom Section */}
              <div
                style={{
                  background: 'var(--bg-page)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-red)', marginBottom: '12px' }}>
                  {role.toUpperCase()} SPECIFIC VERIFICATION DETAILS
                </div>

                {(role === 'donor' || role === 'patient') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select
                        className="form-control"
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      >
                        {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    {role === 'donor' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-control"
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Body Weight (kg)</label>
                          <input
                            type="number"
                            min="45"
                            className="form-control"
                            value={formData.weightKg}
                            onChange={(e) => handleInputChange('weightKg', Number(e.target.value))}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {role === 'hospital' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">State Health Reg. Code</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. HOSP-REG-MH-2024"
                        value={formData.hospitalRegCode}
                        onChange={(e) => handleInputChange('hospitalRegCode', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nodal Doctor / Officer</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Dr. Full Name"
                        value={formData.nodalOfficerName}
                        onChange={(e) => handleInputChange('nodalOfficerName', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {role === 'blood_bank' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">FDA / Drug Controller License</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. BB-LIC-2024-9901"
                        value={formData.bankLicenseNumber}
                        onChange={(e) => handleInputChange('bankLicenseNumber', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Storage Capacity (Units)</label>
                      <input
                        type="number"
                        min="50"
                        className="form-control"
                        value={formData.storageCapacity}
                        onChange={(e) => handleInputChange('storageCapacity', Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {loading ? 'Creating Account...' : `Register as ${role.replace('_', ' ').toUpperCase()}`}
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Already registered in the network?{' '}
                <Link to="/login" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>
                  Sign In here
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

export default Register;
