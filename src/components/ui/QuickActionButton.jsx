import React from 'react';

const QuickActionButton = ({ icon: Icon, label, onClick }) => {
  return (
    <button 
        onClick={onClick} 
        className="relative shrink-0 outline-none active:scale-[0.98] transition-transform duration-200"
        style={{
            width: '372px',
            height: '100px',
            borderRadius: '40px',
            // Shadow on parent for the glow
            boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' 
        }}
    >
      {/* LAYER 1: BACKGROUND FILL & CONTENT 
          Placed first so it sits behind the border ring. */}
      <div 
        className="flex items-center h-full w-full relative overflow-hidden"
        style={{
            // FIXED: Hex #17171A at 70% opacity
            backgroundColor: 'rgba(23, 23, 26, 0.7)', 
            
            backdropFilter: 'blur(20px)',
            borderRadius: '40px', 
            paddingLeft: '24px',
            paddingRight: '24px'
        }}
      >
          {/* ICON CONTAINER */}
          <div 
            className="flex items-center justify-center shrink-0"
            style={{
                width: '56px',
                height: '56px',
                borderRadius: '40px',
                // Solid Gradient Fill for Icon (30% opacity)
                background: 'linear-gradient(90deg, rgba(0, 183, 255, 0.3) 0%, rgba(185, 7, 255, 0.3) 100%)',
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
            }}
          >
             <Icon size={28} color="#E5E5E5" />
          </div>

          {/* Text Label */}
          <span 
            className="ml-6 font-semibold text-[#E5E5E5]"
            style={{
                fontFamily: 'Lexend',
                fontSize: '32px',
                lineHeight: '40px'
            }}
          >
            {label}
          </span>
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
    </button>
  );
};

export default QuickActionButton;