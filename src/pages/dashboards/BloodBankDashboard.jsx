import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Thermometer
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { inventoryService } from '../../services/inventoryService';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';

export const BloodBankDashboard = () => {
  const { user } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState('');
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  // New batch form state
  const [batchForm, setBatchForm] = useState({
    bloodGroup: 'O+',
    componentType: 'whole_blood',
    unitsAvailable: 15,
    batchNumber: `BAT-2026-BB-${Math.floor(100 + Math.random() * 900)}`,
    collectionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageTemp: 4.0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [invData, reqData] = await Promise.all([
        inventoryService.getInventory(),
        requestService.getRequests()
      ]);
      setInventory(invData);
      setRequests(reqData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.addBatch({
        ...batchForm,
        bloodBankName: user?.fullName || 'Metro Central Blood Bank',
        bloodBankId: user?.id || 1,
        city: user?.city || 'Mumbai',
        phone: user?.phone || '+91 22 2410 8899'
      });
      setIsAddBatchOpen(false);
      setActionAlert(`New batch ${batchForm.batchNumber} (${batchForm.unitsAvailable} Units of ${batchForm.bloodGroup}) registered into cold storage.`);
      loadData();
    } catch (err) {
      setActionAlert(`Failed to add batch: ${err.message || 'Validation or database error'}`);
      console.error(err);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus, reason = '') => {
    try {
      await requestService.updateRequestStatus(requestId, newStatus, reason);
      setActionAlert(`Requisition #${requestId} status successfully updated to: ${newStatus.toUpperCase()}`);
      loadData();
    } catch (err) {
      setActionAlert(`Error updating requisition #${requestId}: ${err.message || 'Operation failed'}`);
      console.error(err);
    }
  };

  // Expiry calculation helper
  const getExpiryNotice = (expiryDateStr) => {
    const today = new Date();
    const exp = new Date(expiryDateStr);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'EXPIRED', color: '#DC2626' };
    if (diffDays <= 7) return { label: `${diffDays}d (Expiring Soon)`, color: '#D97706' };
    return { label: `${diffDays}d Valid`, color: '#059669' };
  };

  const totalUnitsInStock = inventory.reduce((acc, curr) => acc + (curr.unitsAvailable || 0), 0);

  return (
    <DashboardLayout
      title={user?.fullName || 'Metro Central Blood Bank'}
      subtitle="Cold-chain inventory logs, batch expiry tracking, and incoming requisition fulfillment."
    >
      {actionAlert && (
        <Alert
          type="success"
          message={actionAlert}
          onClose={() => setActionAlert('')}
        />
      )}

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Units in Cold Storage</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-red)', marginTop: '4px' }}>
            {totalUnitsInStock}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Capacity: 850 Units Max</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Requisitions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
            {requests.filter((r) => r.status === 'pending').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting doctor/bank validation</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Storage Temperature</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={24} /> 4.0°C
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Compliant with WHO/FDA standard</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>License Number</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {user?.licenseNumber || 'BB-MH-MUM-2023-0192'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>Govt Certified Blood Center</div>
        </div>
      </div>

      {/* Section 1: Cold Storage Inventory Table with Expiry Engine */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Cold-Chain Blood Inventory & Expiry Tracker
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time batch shelf-life and quarantined stock status
            </p>
          </div>
          <button
            onClick={() => setIsAddBatchOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} /> Add New Batch
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Scanning cold storage sensors..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Batch No.</th>
                  <th style={{ padding: '12px 8px' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px' }}>Component</th>
                  <th style={{ padding: '12px 8px' }}>Available Units</th>
                  <th style={{ padding: '12px 8px' }}>Reserved</th>
                  <th style={{ padding: '12px 8px' }}>Collection Date</th>
                  <th style={{ padding: '12px 8px' }}>Expiry & Shelf-Life</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const expNotice = getExpiryNotice(item.expiryDate);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.batchNumber}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        {item.componentType.replace('_', ' ').toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: 'var(--primary-red)' }}>
                        {item.unitsAvailable}
                      </td>
                      <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                        {item.unitsReserved || 0}
                      </td>
                      <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                        {item.collectionDate}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{ fontWeight: 700, color: expNotice.color, fontSize: '0.85rem' }}>
                          {item.expiryDate} ({expNotice.label})
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Incoming Requisitions Triage Queue */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Incoming Requisitions & Emergency Dispatch Queue
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Action hospital and patient requirements: Reserve stock or sign off dispatch delivery
          </p>
        </div>

        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
            No incoming requisitions currently pending.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px' }}>Code</th>
                  <th style={{ padding: '12px 8px' }}>Patient / Hospital</th>
                  <th style={{ padding: '12px 8px' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px' }}>Units</th>
                  <th style={{ padding: '12px 8px' }}>Urgency</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Bank Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--primary-red)' }}>
                      {r.requestCode}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{r.patientName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.hospitalName}</div>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <BloodGroupBadge bloodGroup={r.bloodGroup} size="sm" />
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{r.unitsRequested}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span className="badge badge-danger">{r.urgency.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <StatusBadge status={r.status} />
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'reserved')}
                              className="btn btn-secondary btn-sm"
                              title="Reserve in inventory"
                            >
                              Hold / Reserve
                            </button>
                            <button
                              onClick={() => {
                                const reason = window.prompt('Reason for rejection:', 'Insufficient inventory in cold storage');
                                if (reason !== null) {
                                  handleUpdateStatus(r.id, 'rejected', reason);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#DC2626', borderColor: '#FECACA' }}
                              title="Reject requisition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {r.status === 'reserved' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'issued')}
                              className="btn btn-primary btn-sm"
                              title="Dispatch and sign off delivery"
                            >
                              Dispatch / Issue
                            </button>
                            <button
                              onClick={() => {
                                const reason = window.prompt('Reason for cancellation/release:', 'Hospital canceled requirement');
                                if (reason !== null) {
                                  handleUpdateStatus(r.id, 'cancelled', reason);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#DC2626', borderColor: '#FECACA' }}
                              title="Cancel reservation"
                            >
                              Release
                            </button>
                          </>
                        )}
                        {r.status === 'issued' && (
                          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                            ✓ Dispatched
                          </span>
                        )}
                        {r.status === 'rejected' && (
                          <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
                            ✗ Rejected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Batch Modal */}
      {isAddBatchOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddBatchOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Layers size={20} color="#8B0000" />
                Register New Blood Batch in Storage
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddBatchOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBatch}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Batch Identifier</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={batchForm.batchNumber}
                      onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-control"
                      value={batchForm.bloodGroup}
                      onChange={(e) => setBatchForm({ ...batchForm, bloodGroup: e.target.value })}
                    >
                      {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Component Type</label>
                    <select
                      className="form-control"
                      value={batchForm.componentType}
                      onChange={(e) => setBatchForm({ ...batchForm, componentType: e.target.value })}
                    >
                      <option value="whole_blood">Whole Blood</option>
                      <option value="packed_rbc">Packed RBCs</option>
                      <option value="platelets">Platelets</option>
                      <option value="fresh_frozen_plasma">Fresh Frozen Plasma</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Units Available</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-control"
                      value={batchForm.unitsAvailable}
                      onChange={(e) => setBatchForm({ ...batchForm, unitsAvailable: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Collection Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={batchForm.collectionDate}
                      onChange={(e) => setBatchForm({ ...batchForm, collectionDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={batchForm.expiryDate}
                      onChange={(e) => setBatchForm({ ...batchForm, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddBatchOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BloodBankDashboard;
