import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  FileText
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import ClinicalSlipModal from '../../components/common/ClinicalSlipModal';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';

export const HospitalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const handleOpenClinicalSlip = (requisition) => {
    if (!requisition) return;
    // Verify requisition object or look up by ID/code
    const target =
      typeof requisition === 'object'
        ? requisition
        : requests.find((item) => item.id === requisition || item.requestCode === requisition);
    if (target) {
      setSelectedSlip(target);
    }
  };

  // Bulk requisition modal form
  const [surgeryForm, setSurgeryForm] = useState({
    surgeryType: 'Open Heart Coronary Bypass',
    patientName: 'Kishore Trivedi',
    bloodGroup: 'B+',
    componentType: 'whole_blood',
    unitsNeeded: 3,
    scheduledDate: '2026-10-14',
    surgeonNodal: 'Dr. Arvind Mehra'
  });

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateSurgeryRequest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientName: surgeryForm.patientName,
        hospitalName: user?.fullName || 'Apex Memorial Hospital',
        bloodGroup: surgeryForm.bloodGroup,
        componentType: surgeryForm.componentType,
        unitsRequested: surgeryForm.unitsNeeded,
        urgency: 'urgent',
        city: user?.city || 'Mumbai',
        deliveryAddress: 'OT Ward 3, Surgical Suite',
        contactPhone: user?.phone || '+91 9820011223',
        doctorPrescription: `Scheduled Surgery: ${surgeryForm.surgeryType} on ${surgeryForm.scheduledDate}. Attending Surgeon: ${surgeryForm.surgeonNodal}`,
        requesterRole: 'hospital',
        requesterUserId: user?.id || 4
      };

      await requestService.createRequest(payload);
      setIsBulkModalOpen(false);
      setActionNotice(`Requisition created for ${surgeryForm.surgeryType} (${surgeryForm.unitsNeeded} Units of ${surgeryForm.bloodGroup}). Assigned for bank reservation.`);
      loadRequests();
    } catch (err) {
      console.error(err);
      setActionNotice(`Failed to schedule surgery requisition: ${err.message || 'Operation failed'}`);
    }
  };

  return (
    <DashboardLayout
      title={user?.fullName || 'Apex Memorial Hospital'}
      subtitle="Surgical ward reservations, in-patient cross-matching requisitions, and emergency trauma dispatch."
    >
      {actionNotice && (
        <Alert
          type="success"
          message={actionNotice}
          onClose={() => setActionNotice('')}
        />
      )}

      {/* Hospital Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hospital Code</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)', marginTop: '4px' }}>
            {user?.registrationCode || 'HOSP-REG-MUM-4821'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>State Health Department Accredited</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active OT Requisitions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {requests.filter((r) => r.status === 'pending' || r.status === 'reserved').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Surgeries scheduled this week</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Units Delivered & Transfused</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {requests.reduce((acc, curr) => acc + (curr.unitsFulfilled || 0), 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Cold-chain verified delivery</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Ward Bed Count</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            350 Beds
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Priority hospital tier 1</div>
        </div>
      </div>

      {/* Main Table: Hospital Requisitions */}
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
              Hospital In-Patient & Surgery Requisitions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time synchronization with connected cold storage blood banks
            </p>
          </div>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} /> Requisition for Surgery
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving hospital surgical requirements..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Code</th>
                  <th style={{ padding: '12px 8px' }}>Patient Name</th>
                  <th style={{ padding: '12px 8px' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                  <th style={{ padding: '12px 8px' }}>Urgency</th>
                  <th style={{ padding: '12px 8px' }}>Assigned Bank</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--primary-red)' }}>
                      {r.requestCode}
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{r.patientName}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <BloodGroupBadge bloodGroup={r.bloodGroup} size="sm" />
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{r.unitsRequested}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className="badge badge-danger">{r.urgency.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                      {r.assignedBloodBankName}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <StatusBadge status={r.status} />
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenClinicalSlip(r)}
                        className="btn btn-secondary btn-sm"
                        id={`clinical-slip-btn-${r.id || r.requestCode}`}
                        title="View clinical requisition slip"
                      >
                        <FileText size={14} /> Clinical Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Surgery Requisition Modal */}
      {isBulkModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Building2 size={20} color="#8B0000" />
                Schedule Surgery Blood Requisition
              </div>
              <button className="modal-close-btn" onClick={() => setIsBulkModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSurgeryRequest}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Surgical Procedure Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={surgeryForm.surgeryType}
                    onChange={(e) => setSurgeryForm({ ...surgeryForm, surgeryType: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">In-Patient Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={surgeryForm.patientName}
                      onChange={(e) => setSurgeryForm({ ...surgeryForm, patientName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attending Chief Surgeon</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={surgeryForm.surgeonNodal}
                      onChange={(e) => setSurgeryForm({ ...surgeryForm, surgeonNodal: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Required Blood Group</label>
                    <select
                      className="form-control"
                      value={surgeryForm.bloodGroup}
                      onChange={(e) => setSurgeryForm({ ...surgeryForm, bloodGroup: e.target.value })}
                    >
                      {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Units Needed</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      required
                      className="form-control"
                      value={surgeryForm.unitsNeeded}
                      onChange={(e) => setSurgeryForm({ ...surgeryForm, unitsNeeded: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={surgeryForm.scheduledDate}
                      onChange={(e) => setSurgeryForm({ ...surgeryForm, scheduledDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsBulkModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Surgery Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Requisition Slip Modal */}
      {selectedSlip && (
        <ClinicalSlipModal
          requisition={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default HospitalDashboard;
