import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

const GradientTimePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  // Parse 24h string (e.g. "14:05") into parts
  const parseTime = (timeStr) => {
    if (!timeStr) return { h: 12, m: '00', ampm: 'PM' };
    let [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // convert 0 to 12
    return { h, m: m.toString().padStart(2, '0'), ampm };
  };

  const { h: currH, m: currM, ampm: currAmpm } = parseTime(value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Construct new 24h string and trigger onChange
  const updateTime = (newH, newM, newAmpm) => {
    let hour24 = newH;
    if (newAmpm === 'PM' && hour24 < 12) hour24 += 12;
    if (newAmpm === 'AM' && hour24 === 12) hour24 = 0;
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newM}`;
    onChange({ target: { name: label.toLowerCase().replace(' ', ''), value: timeString } });
  };

  // Generate Arrays
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 00, 05, 10...
  const periods = ['AM', 'PM'];

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[#B0B0B0] text-sm font-medium ml-2 mb-1 block">
        {label}
      </label>

      {/* TRIGGER BUTTON (Matches GradientSelect style) */}
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
        <span className="font-light">
            {currH}:{currM} {currAmpm}
        </span>
        <ChevronDown 
            size={20} 
            className={`text-[#B0B0B0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* CUSTOM DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 animate-fade-in origin-top">
            
            {/* Gradient Border Wrapper */}
            <div 
                className="rounded-[24px] p-[1px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                style={{ background: richGradientStr }}
            >
                {/* 3-Column Layout Container */}
                <div 
                    className="bg-[#17171A]/95 rounded-[24px] overflow-hidden p-2 flex gap-1 h-[200px]"
                    style={{ backdropFilter: 'blur(30px)' }}
                >
                    
                    {/* HOURS COLUMN */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1">
                        <div className="text-[#B0B0B0] text-[10px] text-center mb-1 font-bold sticky top-0 bg-[#17171A] z-10">HR</div>
                        {hours.map((h) => (
                            <div
                                key={h}
                                onClick={() => updateTime(h, currM, currAmpm)}
                                className="py-2 text-center rounded-[12px] cursor-pointer transition-all"
                                style={{
                                    background: h === currH ? richGradientStr : 'transparent',
                                    color: h === currH ? '#FFF' : '#B0B0B0',
                                    fontWeight: h === currH ? '600' : '300'
                                }}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* SEPARATOR */}
                    <div className="w-[1px] bg-white/10 my-2"></div>

                    {/* MINUTES COLUMN */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1">
                        <div className="text-[#B0B0B0] text-[10px] text-center mb-1 font-bold sticky top-0 bg-[#17171A] z-10">MIN</div>
                        {minutes.map((m) => (
                            <div
                                key={m}
                                onClick={() => updateTime(currH, m, currAmpm)}
                                className="py-2 text-center rounded-[12px] cursor-pointer transition-all"
                                style={{
                                    background: m === currM ? richGradientStr : 'transparent',
                                    color: m === currM ? '#FFF' : '#B0B0B0',
                                    fontWeight: m === currM ? '600' : '300'
                                }}
                            >
                                {m}
                            </div>
                        ))}
                    </div>

                    {/* SEPARATOR */}
                    <div className="w-[1px] bg-white/10 my-2"></div>

                    {/* AM/PM COLUMN */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1">
                        <div className="text-[#B0B0B0] text-[10px] text-center mb-1 font-bold sticky top-0 bg-[#17171A] z-10">--</div>
                        {periods.map((p) => (
                            <div
                                key={p}
                                onClick={() => updateTime(currH, currM, p)}
                                className="py-2 text-center rounded-[12px] cursor-pointer transition-all"
                                style={{
                                    background: p === currAmpm ? richGradientStr : 'transparent',
                                    color: p === currAmpm ? '#FFF' : '#B0B0B0',
                                    fontWeight: p === currAmpm ? '600' : '300'
                                }}
                            >
                                {p}
                            </div>
                        ))}
                    </div>

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

export default GradientTimePicker;