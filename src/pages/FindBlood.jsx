import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Droplet,
  MapPin,
  Phone,
  Layers,
  AlertCircle,
  Filter
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BloodGroupBadge from '../components/common/BloodGroupBadge';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { inventoryService } from '../services/inventoryService';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

export const FindBlood = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || 'ALL');
  const [componentType, setComponentType] = useState(searchParams.get('componentType') || 'ALL');
  const [city, setCity] = useState(searchParams.get('city') || '');

  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserveSuccess, setReserveSuccess] = useState('');

  const fetchStock = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (bloodGroup !== 'ALL') filters.bloodGroup = bloodGroup;
      if (componentType !== 'ALL') filters.componentType = componentType;
      if (city.trim() !== '') filters.city = city.trim();

      const data = await inventoryService.getInventory(filters);
      setInventoryList(data);
    } catch (err) {
      console.error('Error fetching inventory stock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [bloodGroup, componentType, city]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStock();
  };

  const handleQuickReserve = async (item) => {
    try {
      const payload = {
        patientName: user?.fullName || 'Direct Search Requester',
        hospitalName: `${item.bloodBankName} (Direct Allocation)`,
        bloodGroup: item.bloodGroup,
        componentType: item.componentType,
        unitsRequested: 1,
        urgency: 'urgent',
        city: item.city || city || 'Mumbai',
        deliveryAddress: item.city ? `${item.bloodBankName}, ${item.city}` : 'Blood Bank Distribution Desk',
        contactPhone: user?.phone || item.phone || '+91 9876543210',
        doctorPrescription: `Direct reserve ticket from Live Blood Search for batch ${item.batchNumber}`,
        requesterRole: user?.role || 'patient',
        requesterUserId: user?.id || 8
      };
      const res = await requestService.createRequest(payload);
      setReserveSuccess(
        `Reservation ticket ${res.data?.requestCode || ''} created for 1 unit of ${item.bloodGroup} at ${item.bloodBankName}. Synced with MySQL database.`
      );
      fetchStock();
    } catch (err) {
      setReserveSuccess(`Reservation request failed: ${err.message || 'Unable to place reserve ticket.'}`);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 200px)' }}>
        {/* Header Breadcrumb Banner */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-red">
              <Droplet size={14} /> Real-Time Database Query
            </span>
            <span className="badge badge-success">Cold-Chain Synchronized</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Live Blood Inventory & Bank Locator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px' }}>
            Search verified blood stocks across registered regional blood banks, government facilities,
            and emergency storage hubs with guaranteed cold-chain temperature compliance.
          </p>
        </div>

        {reserveSuccess && (
          <Alert
            type="success"
            title="Reservation Hold Placed"
            message={reserveSuccess}
            onClose={() => setReserveSuccess('')}
          />
        )}

        {/* Filter Controls Bar */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '32px'
          }}
        >
          <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.8fr auto', gap: '16px', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Blood Group Filter</label>
              <select
                className="form-control"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="ALL">All Blood Groups</option>
                {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Component Type</label>
              <select
                className="form-control"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
              >
                <option value="ALL">All Components</option>
                <option value="whole_blood">Whole Blood</option>
                <option value="packed_rbc">Packed RBCs</option>
                <option value="platelets">Platelets</option>
                <option value="fresh_frozen_plasma">Fresh Frozen Plasma</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / City Filter</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. Mumbai, Pune, Delhi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
              <Filter size={16} /> Filter Results
            </button>
          </form>
        </div>

        {/* Results Area */}
        {loading ? (
          <LoadingSpinner message="Scanning network storage nodes for matching blood units..." />
        ) : inventoryList.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}
          >
            <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>No Exact Stock Match Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 20px' }}>
              No units currently logged for the specified criteria. You can broaden your city search
              or raise an urgent emergency requisition for multi-bank broadcast.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setBloodGroup('ALL');
                  setComponentType('ALL');
                  setCity('');
                }}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
              <Link to="/emergency-request" className="btn btn-emergency">
                <AlertCircle size={16} /> Raise Emergency Request
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Showing {inventoryList.length} Verified Blood Stocks
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Certified Cold Storage • Verified Barcoded Batches
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {inventoryList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Left Block: Blood Badge & Bank info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <BloodGroupBadge bloodGroup={item.bloodGroup} size="lg" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {item.bloodBankName}
                        </h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="#8B0000" /> {item.city}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Layers size={14} /> {item.componentType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>Batch: <strong>{item.batchNumber}</strong></span>
                        <span>•</span>
                        <span>Temp: <strong>{item.storageTemp}°C</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Block: Stock and actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                        {item.unitsAvailable}{' '}
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          Units Ready
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Expiry: {item.expiryDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${item.phone}`}
                        className="btn btn-secondary btn-sm"
                        title="Call Blood Bank"
                      >
                        <Phone size={14} /> {item.phone}
                      </a>
                      <button
                        onClick={() => handleQuickReserve(item)}
                        className="btn btn-primary btn-sm"
                      >
                        Request / Hold
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FindBlood;
