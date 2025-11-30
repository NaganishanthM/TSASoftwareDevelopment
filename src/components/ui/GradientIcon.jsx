import React from 'react';

const GradientIcon = ({ icon: Icon, size = 24 }) => (
  <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shrink-0">
    <div 
      className="absolute inset-0 opacity-30"
      style={{ background: 'linear-gradient(90deg, #00B7FF 0%, #B907FF 100%)' }}
    />
    <Icon size={size} color="#E5E5E5" />
  </div>
);

export default GradientIcon;