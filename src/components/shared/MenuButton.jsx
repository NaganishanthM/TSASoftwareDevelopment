import React from 'react';
import { BsChevronRight } from "react-icons/bs";

const MenuButton = ({ icon: Icon, label, onClick, isDanger }) => {
  
  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';
  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.3) 0%, rgba(185, 7, 255, 0.3) 100%)`;

  return (
    <button 
        onClick={onClick}
        className="relative w-full h-[100px] shrink-0 group active:scale-[0.98] transition-transform outline-none"
        style={{ borderRadius: '40px' }}
    >
        {/* --- GRADIENT BORDER STROKE --- */}
        <div 
            className="absolute inset-0 pointer-events-none rounded-[40px] z-20"
            style={{
                padding: '1.5px', 
                background: mainGradient, 
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' 
            }}
        />

        {/* --- CONTENT WRAPPER --- */}
        <div 
            className="absolute inset-0 w-full h-full rounded-[40px] flex items-center px-7 overflow-hidden z-10"
            style={{
                background: 'rgba(23, 23, 26, 0.7)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* ICON CONTAINER */}
            <div 
                className="w-[56px] h-[56px] rounded-[40px] flex items-center justify-center shrink-0 relative overflow-hidden"
            >
                 {/* Icon Background (30% opacity gradient) */}
                 <div className="absolute inset-0" style={{ background: richGradientStr }} />
                 
                 {/* Icon */}
                 <Icon size={24} className={isDanger ? "text-red-500 relative z-10" : "text-[#E5E5E5] relative z-10"} />
            </div>

            {/* TEXT */}
            <span 
                className={`ml-6 text-[32px] font-semibold flex-1 text-left truncate ${isDanger ? 'text-red-500' : 'text-[#E5E5E5]'}`}
                style={{ fontFamily: 'Lexend' }}
            >
                {label}
            </span>

            {/* ARROW (Subtle) */}
            {!isDanger && (
                <BsChevronRight size={24} className="text-[#B0B0B0] opacity-50" />
            )}
        </div>
    </button>
  );
};

export default MenuButton;