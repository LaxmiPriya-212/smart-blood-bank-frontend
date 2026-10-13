import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let className = 'badge-warning';
  let label = status.replace('_', ' ').toUpperCase();

  switch (normalized) {
    case 'available':
    case 'approved':
    case 'issued':
    case 'completed':
    case 'active':
      className = 'badge-success';
      break;
    case 'critical_emergency':
    case 'critical':
    case 'expired':
    case 'rejected':
    case 'cancelled':
      className = 'badge-danger';
      break;
    case 'low_stock':
    case 'urgent':
    case 'reserved':
    case 'scheduled':
      className = 'badge-warning';
      break;
    case 'pending':
    case 'quarantined':
      className = 'badge-red';
      break;
    default:
      className = 'badge-red';
  }

  return <span className={`badge ${className}`}>{label}</span>;
};

export default StatusBadge;
