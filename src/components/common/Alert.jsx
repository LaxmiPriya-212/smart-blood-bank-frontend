import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, title, onClose, className = '' }) => {
  if (!message && !title) return null;

  const config = {
    info: {
      bg: 'var(--accent-rose)',
      border: 'var(--accent-rose-border)',
      color: 'var(--primary-red)',
      icon: <Info size={20} />
    },
    success: {
      bg: '#ECFDF5',
      border: '#A7F3D0',
      color: '#065F46',
      icon: <CheckCircle size={20} />
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FDE68A',
      color: '#B45309',
      icon: <AlertTriangle size={20} />
    },
    error: {
      bg: '#FEF2F2',
      border: '#FECACA',
      color: '#B91C1C',
      icon: <AlertCircle size={20} />
    }
  }[type] || config.info;

  return (
    <div
      className={`alert-banner ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        marginBottom: '16px',
        fontSize: '0.9rem'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{config.icon}</div>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', marginBottom: '2px' }}>{title}</strong>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
