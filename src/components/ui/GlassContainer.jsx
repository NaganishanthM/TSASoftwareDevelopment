import React from 'react';

const colors = {
  fillBase: 'rgba(23, 23, 26, 0.7)', // 17171A @ 70%
  gradientStart: '#00B7FF',
  gradientEnd: '#B907FF',
};

const GlassContainer = ({ children, className = '', rounded = 'rounded-[32px]' }) => (
  <div 
    className={`relative p-[1px] ${rounded} shadow-[0_0_18.9px_rgba(255,255,255,0.1)] shrink-0 ${className}`}
    style={{
      background: `linear-gradient(90deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
    }}
  >
    <div 
      className={`h-full w-full ${rounded} backdrop-blur-[20px] overflow-hidden`}
      style={{ backgroundColor: colors.fillBase }}
    >
      {children}
    </div>
  </div>
);

export default GlassContainer;