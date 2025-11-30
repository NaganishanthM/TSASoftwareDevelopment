import React from 'react';

const NoteCard = ({ title, preview, onClick }) => {
  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;
  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';

  return (
    <div 
        onClick={onClick}
        className="relative w-[167px] h-[244px] shrink-0 group cursor-pointer active:scale-[0.98] transition-transform"
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

        {/* --- CARD CONTENT --- */}
        <div 
            className="absolute inset-0 w-full h-full rounded-[40px] overflow-hidden flex flex-col items-center p-4 z-10"
            style={{
                background: 'rgba(23, 23, 26, 0.7)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* Title */}
            <h3 
                className="text-[#E5E5E5] font-semibold text-[24px] leading-[30px] text-center mt-2 truncate w-full"
                style={{ fontFamily: 'Lexend' }}
            >
                {title}
            </h3>

            {/* Preview Text */}
            <p 
                className="text-[rgba(176,176,176,0.8)] text-[16px] leading-[20px] font-normal mt-4 text-left w-full line-clamp-4 overflow-hidden h-[80px]"
                style={{ fontFamily: 'Lexend' }}
            >
                {preview}
            </p>

            {/* Open Button */}
            <div className="mt-auto w-[145px] h-[40px] relative">
                 {/* Shadow Glow */}
                 <div 
                    className="absolute bottom-0 w-full h-full rounded-[40px] z-0"
                    style={{
                        background: richGradientStr,
                        opacity: 0.7,
                        filter: 'blur(12.5px)',
                        transform: 'scale(0.8) translateY(5px)'
                    }}
                 />
                 
                 <button 
                    className="relative z-10 w-full h-full rounded-[40px] flex items-center justify-center"
                    style={{
                        background: richGradientStr,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)'
                    }}
                 >
                     <span className="text-[#E5E5E5] font-semibold text-[20px]" style={{ fontFamily: 'Lexend' }}>Open</span>
                 </button>
            </div>
        </div>
    </div>
  );
};

export default NoteCard;