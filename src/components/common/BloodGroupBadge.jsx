import React from 'react';

export const BloodGroupBadge = ({ bloodGroup, size = 'md' }) => {
  const sizeMap = {
    sm: { width: '32px', height: '32px', fontSize: '0.85rem' },
    md: { width: '44px', height: '44px', fontSize: '1.1rem' },
    lg: { width: '56px', height: '56px', fontSize: '1.4rem' }
  };

  const style = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        ...style,
        borderRadius: '12px',
        background: 'var(--accent-rose)',
        color: 'var(--primary-red)',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--accent-rose-border)',
        fontFamily: 'var(--font-heading)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {bloodGroup}
    </div>
  );
};

export default BloodGroupBadge;
