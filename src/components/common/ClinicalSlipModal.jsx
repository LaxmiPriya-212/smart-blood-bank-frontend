import React from 'react';
import {
  FileText,
  Printer,
  X,
  Building2,
  Calendar,
  Clock,
  User,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  Hash,
  Activity
} from 'lucide-react';
import BloodGroupBadge from './BloodGroupBadge';
import StatusBadge from './StatusBadge';

export const ClinicalSlipModal = ({ requisition, onClose }) => {
  if (!requisition) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return String(dateString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(dateString) || 'Not available';
    }
  };

  const formatUrgency = (urgency) => {
    if (!urgency) return 'NORMAL';
    return String(urgency).replace(/_/g, ' ').toUpperCase();
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency) {
      case 'critical_emergency':
        return 'badge-danger';
      case 'urgent':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reqCode = requisition.requestCode || (requisition.id ? `REQ-${requisition.id}` : 'N/A');
  const reqId = requisition.id != null ? requisition.id : 'N/A';
  const patientName = requisition.patientName || 'Not specified';
  const bloodGroup = requisition.bloodGroup || 'N/A';
  const unitsRequested = requisition.unitsRequested != null ? requisition.unitsRequested : '—';
  const unitsFulfilled = requisition.unitsFulfilled != null ? requisition.unitsFulfilled : 0;
  const componentType = requisition.componentType
    ? String(requisition.componentType).replace(/_/g, ' ').toUpperCase()
    : 'WHOLE BLOOD';
  const urgency = requisition.urgency || 'normal';
  const assignedBank = requisition.assignedBloodBankName || 'Pending Blood Bank Allocation';
  const status = requisition.status || 'pending';
  const requestDate = formatDate(requisition.createdAt);
  const hospital = requisition.hospitalName || 'Hospital In-Patient Ward';
  const deliveryAddress = requisition.deliveryAddress || 'OT Surgical Wing';
  const city = requisition.city || '';
  const phone = requisition.contactPhone || 'Not specified';
  const notes = requisition.doctorPrescription || 'Scheduled surgical / in-patient clinical requirement';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clinical-slip-title"
    >
      <div
        className="modal-window clinical-slip-modal-window"
        style={{ maxWidth: '720px', width: '100%', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Hidden on Print) */}
        <div className="modal-header no-print">
          <div className="modal-title" id="clinical-slip-title">
            <FileText size={20} color="#8B0000" />
            Clinical Requisition Slip
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close clinical slip"
            id="clinical-slip-top-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Printable Document Area */}
        <div className="modal-body" style={{ padding: '24px' }}>
          <div
            id="clinical-slip-printable"
            className="clinical-slip-document"
            style={{
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              color: '#0F172A',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}
          >
            {/* Slip Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '16px',
                borderBottom: '2px solid #8B0000',
                marginBottom: '18px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Building2 size={22} color="#8B0000" />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8B0000', letterSpacing: '-0.3px' }}>
                    {hospital}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase' }}>
                  Clinical Blood Requisition Slip
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Smart Blood Bank Network Logistics &amp; OT Transfusion Unit
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                  Requisition ID
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8B0000' }}>
                  {reqCode}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  DB Record: #{reqId}
                </div>
              </div>
            </div>

            {/* Quick Status & Urgency Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                marginBottom: '20px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Request Status
                </div>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={status} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Urgency Level
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`badge ${getUrgencyBadgeClass(urgency)}`}>
                    {formatUrgency(urgency)}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Blood Group
                </div>
                <div style={{ marginTop: '4px' }}>
                  <BloodGroupBadge bloodGroup={bloodGroup} size="sm" />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Units Required
                </div>
                <div style={{ marginTop: '4px', fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                  {unitsRequested} Unit(s)
                </div>
              </div>
            </div>

            {/* Two-Column Clinical & Logistics Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}
            >
              {/* Section 1: Patient & Request Specs */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  background: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#8B0000',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={15} /> Patient Information
                </div>

                <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Patient Name: </span>
                    <strong style={{ color: '#0F172A' }}>{patientName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Blood Group Required: </span>
                    <strong style={{ color: '#8B0000' }}>{bloodGroup}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Blood Component: </span>
                    <strong>{componentType}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Quantity Demanded: </span>
                    <strong>{unitsRequested} Unit(s)</strong> (Fulfilled: {unitsFulfilled})
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Contact Phone: </span>
                    <span>{phone}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Blood Bank Allocation & Dispatch */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  background: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#8B0000',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Building2 size={15} /> Allocation &amp; Logistics
                </div>

                <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Assigned Blood Bank: </span>
                    <strong style={{ color: '#0F172A' }}>{assignedBank}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Request Date: </span>
                    <span>{requestDate}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Destination Ward: </span>
                    <span>{deliveryAddress}{city ? `, ${city}` : ''}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Tracking Code: </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{reqCode}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Hospital Code / Facility: </span>
                    <span>{hospital}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Procedure Notes Box */}
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                background: '#F8FAFC',
                marginBottom: '18px'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Clinical Requisition Remarks / Indication:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1E293B', fontStyle: 'italic' }}>
                "{notes}"
              </div>
            </div>

            {/* Institutional Sign-off Block */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
                paddingTop: '18px',
                borderTop: '1px dashed #CBD5E1',
                marginBottom: '18px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ height: '36px', borderBottom: '1px solid #94A3B8', marginBottom: '6px' }}></div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                  Attending Medical Officer
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Requisition Initiator</div>
              </div>

              <div>
                <div style={{ height: '36px', borderBottom: '1px solid #94A3B8', marginBottom: '6px' }}></div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                  OT / Ward Nurse In-Charge
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Cross-Match Sampling</div>
              </div>

              <div>
                <div style={{ height: '36px', borderBottom: '1px solid #94A3B8', marginBottom: '6px' }}></div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                  Blood Bank Dispatch Officer
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Cold-Chain Custody</div>
              </div>
            </div>

            {/* Disclaimer per requirement 7 */}
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '0.74rem',
                color: '#92400E',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Notice:</strong> This document is an institutional clinical blood requisition and logistics tracking slip generated by the Smart Blood Bank Network for hospital-to-bank coordination. It is <u>not</u> an approved doctor's prescription, certified laboratory diagnostic report, or cross-matching compatibility certificate without formal pathologist sign-off.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div className="modal-footer no-print">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            id="clinical-slip-close-btn"
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
            id="clinical-slip-print-btn"
          >
            <Printer size={15} /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSlipModal;
