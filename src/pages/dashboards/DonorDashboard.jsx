import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Award,
  Plus,
  Download
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { donorService } from '../../services/donorService';
import { useAuth } from '../../context/AuthContext';

export const DonorDashboard = () => {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [viewCertificate, setViewCertificate] = useState(null);

  // Self-screening answers
  const [screening, setScreening] = useState({
    ageOver18: true,
    weightOver50: true,
    noRecentDonation: true,
    noChronicIllness: true
  });

  // Appointment schedule form
  const [aptForm, setAptForm] = useState({
    bloodBankName: 'Metro Central Blood Bank',
    date: '2026-10-22T10:30',
    unitsPledged: 1,
    location: 'Parel Medical Complex, Dr. Borges Rd, Mumbai'
  });

  const loadDonorData = async () => {
    setLoading(true);
    try {
      const [histData, aptData] = await Promise.all([
        donorService.getDonorHistory(user?.id || 6),
        donorService.getUpcomingAppointments(user?.id || 6)
      ]);
      setDonations(histData);
      setAppointments(aptData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonorData();
  }, [user?.id]);

  const handleBookSlot = async (e) => {
    e.preventDefault();
    try {
      await donorService.bookAppointment({
        ...aptForm,
        donorId: user?.id || 6,
        status: 'scheduled'
      });
      setIsScheduleOpen(false);
      setActionNotice(`Donation appointment scheduled for ${aptForm.date.replace('T', ' at ')} at ${aptForm.bloodBankName}.`);
      loadDonorData();
    } catch (err) {
      console.error(err);
      setActionNotice(`Failed to schedule appointment: ${err.message || 'Operation failed'}`);
    }
  };

  const isEligible = Object.values(screening).every(Boolean);

  return (
    <DashboardLayout
      title={`Welcome Back, ${user?.fullName || 'Rahul Sharma'}`}
      subtitle="Your voluntary blood donations have directly preserved critical patient lives."
    >
      {actionNotice && (
        <Alert
          type="success"
          message={actionNotice}
          onClose={() => setActionNotice('')}
        />
      )}

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Life Donations</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-red)', marginTop: '4px' }}>
            8 Times
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Preserved up to 24 critical lives</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Donor Blood Group</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <BloodGroupBadge bloodGroup={user?.bloodGroup || 'O-'} size="sm" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#DC2626' }}>
              Universal Donor
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Donation Eligibility</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
              {isEligible ? 'ELIGIBLE TO DONATE TODAY' : 'TEMPORARY HOLD'}
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Next Recommended Date</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            Immediate / On Call
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Last donation: 2026-07-20</div>
        </div>
      </div>

      {/* Emergency On-Call Alert for Donor */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          border: '1px solid var(--accent-rose-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-red)' }}>
              Emergency Need in Your District: O- Negative Critical Low
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Metro Central Blood Bank has 4 units left. Your donation can save an active ICU trauma surgery today.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsScheduleOpen(true)}
          className="btn btn-emergency btn-sm"
        >
          Schedule Slot
        </button>
      </div>

      {/* Two Column Section: Eligibility Self-Check & Upcoming Appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Eligibility Check Box */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
            4-Point Medical Health Screening
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            According to national blood safety guidelines:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={screening.ageOver18}
                onChange={(e) => setScreening({ ...screening, ageOver18: e.target.checked })}
              />
              <span>Age between 18 and 65 years</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={screening.weightOver50}
                onChange={(e) => setScreening({ ...screening, weightOver50: e.target.checked })}
              />
              <span>Weight is 50 kg or greater</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={screening.noRecentDonation}
                onChange={(e) => setScreening({ ...screening, noRecentDonation: e.target.checked })}
              />
              <span>At least 90 days since previous whole blood donation</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={screening.noChronicIllness}
                onChange={(e) => setScreening({ ...screening, noChronicIllness: e.target.checked })}
              />
              <span>No acute symptoms of cold, fever, or infectious disease</span>
            </label>
          </div>
        </div>

        {/* Scheduled Appointments */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Upcoming Slot
            </h3>
            <button onClick={() => setIsScheduleOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Book New
            </button>
          </div>

          {appointments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No slots scheduled.</p>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  background: 'var(--bg-page)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{apt.bloodBankName}</strong>
                  <StatusBadge status={apt.status} />
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {new Date(apt.date).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  📍 {apt.location}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Donation History & Certificate Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Voluntary Donation Certificates & Records
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Official verified blood donation certificates with hemoglobin diagnostics
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving donation history..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Blood Center</th>
                  <th style={{ padding: '12px 8px' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                  <th style={{ padding: '12px 8px' }}>Hb Level</th>
                  <th style={{ padding: '12px 8px' }}>Certificate Ref</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Digital Certificate</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don) => (
                  <tr key={don.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>{don.donationDate}</td>
                    <td style={{ padding: '14px 8px' }}>{don.bloodBankName}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <BloodGroupBadge bloodGroup={don.bloodGroup} size="sm" />
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{don.unitsDonated}</td>
                    <td style={{ padding: '14px 8px', color: '#059669', fontWeight: 600 }}>
                      {don.hemoglobin} g/dL
                    </td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {don.certificateCode}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => setViewCertificate(don)}
                        className="btn btn-outline-red btn-sm"
                      >
                        <Award size={14} /> View Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Slot Modal */}
      {isScheduleOpen && (
        <div className="modal-backdrop" onClick={() => setIsScheduleOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Calendar size={20} color="#8B0000" />
                Schedule Blood Donation Appointment
              </div>
              <button className="modal-close-btn" onClick={() => setIsScheduleOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSlot}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Select Blood Bank Facility</label>
                  <select
                    className="form-control"
                    value={aptForm.bloodBankName}
                    onChange={(e) => setAptForm({ ...aptForm, bloodBankName: e.target.value })}
                  >
                    <option value="Metro Central Blood Bank">Metro Central Blood Bank (Parel, Mumbai)</option>
                    <option value="City Life Blood Center">City Life Blood Center (FC Road, Pune)</option>
                    <option value="Apollo Lifeline Bank">Apollo Lifeline Bank (Sarita Vihar, Delhi)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-control"
                    value={aptForm.date}
                    onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Units Pledged</label>
                  <input
                    type="number"
                    min="1"
                    max="1"
                    className="form-control"
                    value={aptForm.unitsPledged}
                    readOnly
                  />
                  <small style={{ color: 'var(--text-muted)' }}>Standard donation is 1 unit (350ml - 450ml).</small>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsScheduleOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Certificate Modal */}
      {viewCertificate && (
        <div className="modal-backdrop" onClick={() => setViewCertificate(null)}>
          <div className="modal-window" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Award size={20} color="#8B0000" />
                Certificate of Life Saving Appreciation
              </div>
              <button className="modal-close-btn" onClick={() => setViewCertificate(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'center', padding: '30px 24px' }}>
              <div
                style={{
                  border: '6px double var(--primary-red)',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'radial-gradient(circle, #FFF1F2 0%, #FFFFFF 100%)'
                }}
              >
                <div style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '1.4rem', textTransform: 'uppercase' }}>
                  Certificate of Honor
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Presented by Smart Blood Bank National Network
                </div>

                <div style={{ margin: '20px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {user?.fullName || 'Rahul Sharma'}
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  In deep gratitude for voluntarily donating <strong>{viewCertificate.unitsDonated} Unit of {viewCertificate.bloodGroup} Blood</strong> at {viewCertificate.bloodBankName} on {viewCertificate.donationDate}.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Hb: <strong>{viewCertificate.hemoglobin} g/dL</strong></span>
                  <span>Ref: <strong>{viewCertificate.certificateCode}</strong></span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setViewCertificate(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('Certificate downloaded in PDF format.');
                  setViewCertificate(null);
                }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DonorDashboard;
