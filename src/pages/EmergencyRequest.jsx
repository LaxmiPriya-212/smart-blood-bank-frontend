import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Building2,
  Droplet,
  ShieldAlert
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

export const EmergencyRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: '',
    hospitalName: '',
    wardOrBed: 'Emergency Trauma Ward - ICU',
    bloodGroup: 'O-',
    componentType: 'whole_blood',
    unitsRequested: 2,
    urgency: 'critical_emergency',
    city: 'Mumbai',
    deliveryAddress: '',
    contactPhone: '+91 9876543210',
    doctorName: 'Dr. Arvind Mehra (Chief Surgeon)',
    doctorPrescription: 'Acute arterial hemorrhage, cross-matched transfusion required immediately.'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requesterRole: user?.role || 'patient',
        requesterUserId: user?.id || 8
      };

      const res = await requestService.createRequest(payload);
      setCreatedRequest(res.data);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit emergency requisition. Please verify fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
        {/* Banner Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-danger">
              <ShieldAlert size={14} /> Priority Dispatch Grid
            </span>
            <span className="badge badge-red">24/7 National Emergency</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7F1D1D', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Emergency Blood Requisition
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '4px' }}>
            Submit an urgent or critical requirement. The system will broadcast this ticket across certified
            regional blood banks and notify universal donors within an immediate 15km perimeter.
          </p>
        </div>

        {errorMsg && (
          <div style={{ maxWidth: '820px', margin: '0 auto 20px' }}>
            <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
          </div>
        )}

        {createdRequest ? (
          /* Confirmation View */
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 36px',
                border: '1px solid #A7F3D0',
                boxShadow: 'var(--shadow-xl)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <CheckCircle2 size={42} />
              </div>

              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Priority Ticket Broadcasted!
              </h2>

              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Requisition Code: <strong style={{ color: 'var(--primary-red)' }}>{createdRequest.requestCode}</strong>
              </p>

              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  textAlign: 'left',
                  border: '1px solid var(--border-light)',
                  marginBottom: '28px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.92rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                      {createdRequest.patientName}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Blood Group & Units:</span>
                    <strong style={{ display: 'block', color: 'var(--primary-red)' }}>
                      {createdRequest.bloodGroup} ({createdRequest.unitsRequested} Units {createdRequest.componentType.replace('_', ' ').toUpperCase()})
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Hospital Destination:</span>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                      {createdRequest.hospitalName} ({formData.wardOrBed})
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Blood Bank:</span>
                    <strong style={{ display: 'block', color: '#059669' }}>
                      {createdRequest.assignedBloodBankName}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Urgency Priority:</span>
                    <span className="badge badge-danger" style={{ marginTop: '4px' }}>
                      {createdRequest.urgency.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Contact Helpline:</span>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                      {createdRequest.contactPhone}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setCreatedRequest(null);
                    setFormData((prev) => ({ ...prev, patientName: '' }));
                  }}
                  className="btn btn-secondary"
                >
                  Create Another Requisition
                </button>
                <Link to="/find-blood" className="btn btn-primary">
                  View Live Bank Availability
                </Link>
                {user && (
                  <Link to={`/dashboard/${user.role}`} className="btn btn-outline-red">
                    Go to My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Requisition Form */
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '36px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <form onSubmit={handleSubmit}>
                {/* 1. Patient & Hospital Info */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} /> 1. Patient & Hospital Ward Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Ramesh Patil"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hospital / Medical Center Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Apex Memorial Hospital"
                      value={formData.hospitalName}
                      onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">Ward / Bed / ICU Details *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. ICU Bed #4"
                      value={formData.wardOrBed}
                      onChange={(e) => handleInputChange('wardOrBed', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
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
                    <label className="form-label">Doctor / Hospital Helpline *</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Blood & Urgency Requirement */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={18} /> 2. Blood Component & Urgency Level
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '14px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group *</label>
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

                  <div className="form-group">
                    <label className="form-label">Component *</label>
                    <select
                      className="form-control"
                      value={formData.componentType}
                      onChange={(e) => handleInputChange('componentType', e.target.value)}
                    >
                      <option value="whole_blood">Whole Blood</option>
                      <option value="packed_rbc">Packed RBCs</option>
                      <option value="platelets">Platelets</option>
                      <option value="fresh_frozen_plasma">Fresh Frozen Plasma</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Units Needed *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      className="form-control"
                      value={formData.unitsRequested}
                      onChange={(e) => handleInputChange('unitsRequested', Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency Priority *</label>
                    <select
                      className="form-control"
                      style={{
                        borderColor: formData.urgency === 'critical_emergency' ? '#DC2626' : '',
                        fontWeight: 700
                      }}
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                    >
                      <option value="critical_emergency">CRITICAL EMERGENCY (&lt; 30 Mins)</option>
                      <option value="urgent">URGENT (&lt; 4 Hours)</option>
                      <option value="normal">ROUTINE / SCHEDULED (24 Hours)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Clinical Notes & Prescription */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Clinical Indication / Diagnosis Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Provide patient clinical diagnosis, Hb levels, or surgical justification..."
                    value={formData.doctorPrescription}
                    onChange={(e) => handleInputChange('doctorPrescription', e.target.value)}
                  />
                </div>

                <div
                  style={{
                    background: '#FEF2F2',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #FECACA',
                    fontSize: '0.85rem',
                    color: '#991B1B',
                    marginBottom: '24px'
                  }}
                >
                  <strong>Emergency Protocol:</strong> Submitting this ticket triggers an automated multi-bank hold across certified cold storage hubs and sends priority dispatch alerts.
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-emergency btn-lg"
                  >
                    <AlertCircle size={18} />
                    {loading ? 'Transmitting Request...' : 'Transmit Priority Emergency Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EmergencyRequest;
