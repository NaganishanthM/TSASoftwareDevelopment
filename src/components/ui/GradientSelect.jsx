import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const GradientSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: label.toLowerCase(), value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || "Select";

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[#B0B0B0] text-sm font-medium ml-2 mb-1 block">
        {label}
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#17171A] text-[#E5E5E5] rounded-[20px] px-4 py-3 border border-white/10 flex justify-between items-center transition-all duration-200 outline-none"
        style={{
            borderColor: isOpen ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            backgroundImage: isOpen ? `linear-gradient(#17171A, #17171A), ${richGradientStr}` : 'none',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
        }}
      >
        <span className="font-light truncate">{selectedLabel}</span>
        <ChevronDown 
            size={20} 
            className={`text-[#B0B0B0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 animate-fade-in origin-top">
            {/* Gradient Border Wrapper */}
            <div 
                className="rounded-[24px] p-[1px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                style={{ background: richGradientStr }}
            >
                {/* Menu Content */}
                <div 
                    className="bg-[#17171A]/90 rounded-[24px] overflow-hidden max-h-[250px] overflow-y-auto no-scrollbar p-2"
                    style={{ backdropFilter: 'blur(30px)' }} // Increased blur
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                // PILL SHAPE: rounded-xl, margin, padding
                                className="px-4 py-3 mb-1 last:mb-0 cursor-pointer transition-all duration-200 flex items-center justify-between group rounded-[16px]"
                                style={{
                                    background: isSelected ? richGradientStr : 'transparent',
                                }}
                            >
                                <span className={`font-light ${isSelected ? 'text-white font-semibold' : 'text-[#B0B0B0] group-hover:text-white'}`}>
                                    {option.label}
                                </span>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default GradientSelect;