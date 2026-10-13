import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const filters = user?.id ? { requesterUserId: user.id } : {};
      let data = await requestService.getRequests(filters);
      if ((!data || data.length === 0) && user?.role === 'patient') {
        data = await requestService.getRequests({ requesterRole: 'patient' });
      }
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setActionNotice(`Failed to load requisitions: ${err.message || 'Database error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user?.id]);

  const activeRequest = requests[0] || null;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.fullName || 'Patient'}`}
      subtitle="Track your blood requisitions, check live allocation stages, and locate donor camps."
    >
      {actionNotice && (
        <Alert
          type="info"
          message={actionNotice}
          onClose={() => setActionNotice('')}
        />
      )}

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Requisitions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-red)', marginTop: '4px' }}>
            {requests.filter((r) => r.status === 'pending' || r.status === 'reserved').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Under continuous hospital monitoring</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Transfusions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {requests.filter((r) => r.status === 'issued').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Cold-chain verified</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Blood Group</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <BloodGroupBadge bloodGroup={user?.bloodGroup || 'AB+'} size="sm" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Universal Recipient
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Helpline</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>
            1800-BLOOD-SOS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Direct ambulance & bank line</div>
        </div>
      </div>

      {/* Live Requisition Tracker Bar */}
      {activeRequest && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-red">{activeRequest.urgency.replace('_', ' ').toUpperCase()}</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  Active Request: {activeRequest.requestCode}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                Patient: <strong>{activeRequest.patientName}</strong> • {activeRequest.hospitalName} • Assigned to {activeRequest.assignedBloodBankName}
              </p>
            </div>
            <StatusBadge status={activeRequest.status} />
          </div>

          {/* Stepper Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
            {[
              { step: '1. Request Raised', desc: 'Prescription submitted', active: true },
              { step: '2. Bank Review', desc: 'Cross-matching stock', active: activeRequest.status !== 'pending' },
              { step: '3. Units Reserved', desc: 'Hold placed in cold storage', active: activeRequest.status === 'reserved' || activeRequest.status === 'issued' },
              { step: '4. Dispatched / Issued', desc: 'Delivered to hospital OT/ICU', active: activeRequest.status === 'issued' }
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: s.active ? '#ECFDF5' : '#F8FAFC',
                  border: `1px solid ${s.active ? '#A7F3D0' : 'var(--border-light)'}`,
                  color: s.active ? '#065F46' : 'var(--text-muted)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.step}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blood Requests Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              My Requisition History
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              All emergency and routine blood tickets raised from your account
            </p>
          </div>
          <Link to="/emergency-request" className="btn btn-emergency btn-sm">
            <Plus size={15} /> Raise Emergency Ticket
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading patient requisitions..." />
        ) : requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
            No blood requests found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Requisition Code</th>
                  <th style={{ padding: '12px 8px' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                  <th style={{ padding: '12px 8px' }}>Hospital Ward</th>
                  <th style={{ padding: '12px 8px' }}>Urgency</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--primary-red)' }}>
                      {req.requestCode}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{req.unitsRequested}</td>
                    <td style={{ padding: '14px 8px' }}>{req.hospitalName}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className="badge badge-red">{req.urgency}</span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() =>
                          setActionNotice(`Viewing digital pickup pass for ${req.requestCode} at ${req.hospitalName}.`)
                        }
                        className="btn btn-secondary btn-sm"
                      >
                        Pickup Pass
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
