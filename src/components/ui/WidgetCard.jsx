import React from 'react';

const WidgetCard = ({ children }) => {
  return (
    <div 
      className="shrink-0 relative snap-center"
      style={{
          width: '210px',
          height: '242px',
          borderRadius: '40px',
          boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* LAYER 1: BACKGROUND FILL & CONTENT */}
      <div 
          className="w-full h-full flex flex-col p-4 relative overflow-hidden"
          style={{
              // FIXED: Hex #17171A at 70% opacity
              backgroundColor: 'rgba(23, 23, 26, 0.7)',
              
              backdropFilter: 'blur(10px)',
              borderRadius: '40px',
          }}
      >
        {children}
      </div>

      {/* LAYER 2: THE GRADIENT BORDER (Overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[40px]"
        style={{
            padding: '1.5px', 
            background: 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
        }}
      />
    </div>
  );
};

export default WidgetCard;