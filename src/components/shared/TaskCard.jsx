import React from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react'; 

const TaskCard = ({ title, subtitle, isCompleted, priority = 'normal', onToggle, onClick }) => {
  
  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;
  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';

  // Handle the click on the checkbox circle
  // stopPropagation prevents the card's main onClick from firing
  const handleCheckClick = (e) => {
    e.stopPropagation(); 
    if (onToggle) onToggle();
  };

  // Render the Priority Indicator (Right Side)
  const renderPriorityIndicator = () => {
    // Define unique gradient ID for this card instance to avoid ID conflicts
    // removing spaces from title to make valid ID
    const gradId = `prio-${title.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const svgGradientDef = (
        <svg width="0" height="0">
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#00B7FF" offset="0%" />
            <stop stopColor="#B907FF" offset="100%" />
          </linearGradient>
        </svg>
    );

    if (priority === 'high') {
      return (
        <div className="w-[24px] h-[34px] flex items-center justify-center relative">
            {svgGradientDef}
            <ArrowUp 
                size={24} 
                style={{ 
                    stroke: `url(#${gradId})`, 
                    strokeWidth: 3, 
                    width: '24px',
                    height: '24px' 
                }} 
            />
        </div>
      );
    }
    
    if (priority === 'low') {
        return (
          <div className="w-[24px] h-[34px] flex items-center justify-center relative">
              {svgGradientDef}
              <ArrowDown 
                size={24} 
                style={{ 
                    stroke: `url(#${gradId})`, 
                    strokeWidth: 3,
                    width: '24px',
                    height: '24px'
                }} 
              />
          </div>
        );
    }

    // Normal Priority: Gradient Ellipse
    return (
      <div 
        className="w-[24px] h-[24px] rounded-full"
        style={{
            background: richGradientStr,
            boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
        }}
      />
    );
  };

  return (
    <div 
        onClick={onClick} // Opens the Edit Modal
        className="w-full h-[80px] shrink-0 relative group active:scale-[0.98] transition-all duration-300 cursor-pointer"
        style={{
            // Opacity 50% if completed
            opacity: isCompleted ? 0.5 : 1,
            width: '100%', 
            borderRadius: '40px'
        }}
    >
       {/*  GRADIENT BORDER STROKE  */}
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

      {/*  CARD CONTENT WRAPPER  */}
      <div 
        className="flex items-center h-full px-6 gap-4 relative z-10 overflow-hidden rounded-[40px]"
        style={{
            // Dark Fill
            background: 'rgba(23, 23, 26, 0.7)',
            backdropFilter: 'blur(10px)',
        }}
      >
        
        {/*  LEFT: CHECKBOX CONTAINER  */}
        <button 
            onClick={handleCheckClick}
            className="w-[40px] h-[40px] shrink-0 rounded-full relative flex items-center justify-center transition-all"
            style={{
                // Base style for both states
                background: 'rgba(23, 23, 26, 0.7)',
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
            }}
        >
             {isCompleted && (
                 // If checked, show gradient checkmark
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <defs>
                            <linearGradient id={`check-gradient-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop stopColor="#00B7FF" offset="0%" />
                                <stop stopColor="#B907FF" offset="100%" />
                            </linearGradient>
                        </defs>
                        <Check size={20} strokeWidth={4} style={{ stroke: `url(#check-gradient-${title.replace(/[^a-zA-Z0-9]/g, '')})` }} />
                    </svg>
                 </div>
             )}
        </button>

        {/*  CENTER: TEXT  */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 
                className={`font-semibold truncate transition-colors ${isCompleted ? 'text-[#B0B0B0]' : 'text-[#E5E5E5]'}`}
                style={{ 
                    fontFamily: 'Lexend', 
                    fontSize: '20px', 
                    lineHeight: '24px', 
                    textDecoration: isCompleted ? 'line-through' : 'none' 
                }}
            >
                {title}
            </h3>
            
            <p 
                className="font-normal truncate"
                style={{ fontFamily: 'Lexend', fontSize: '14px', lineHeight: '18px', color: 'rgba(176, 176, 176, 0.8)' }}
            >
                {subtitle}
            </p>
        </div>

        {/*  RIGHT: PRIORITY INDICATOR  */}
        <div className="shrink-0 w-[24px] flex justify-center items-center">
            {renderPriorityIndicator()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;