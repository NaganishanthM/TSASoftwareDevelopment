import React, { useState } from 'react';
import { X } from 'lucide-react';
import GradientSelect from '../ui/GradientSelect';

const CustomRepeatModal = ({ isOpen, onClose, onSave }) => {
  const [frequency, setFrequency] = useState('1');
  const [unit, setUnit] = useState('week'); 
  const [selectedDays, setSelectedDays] = useState([]); 

  // UPDATED: Use 3-letter codes for clearer logic, but keep label short for UI if desired
  const weekDays = [
    { label: 'S', code: 'Sun', value: 0 },
    { label: 'M', code: 'Mon', value: 1 },
    { label: 'T', code: 'Tue', value: 2 },
    { label: 'W', code: 'Wed', value: 3 },
    { label: 'T', code: 'Thu', value: 4 },
    { label: 'F', code: 'Fri', value: 5 },
    { label: 'S', code: 'Sat', value: 6 },
  ];

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  const toggleDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSave = () => {
    const unitStr = parseInt(frequency) > 1 ? `${unit}s` : unit;
    let summary = `Every ${frequency} ${unitStr}`;
    
    if (unit === 'week' && selectedDays.length > 0) {
        // FIX: Use 3-letter codes (Sun, Mon) for unambiguous parsing later
        const dayNames = selectedDays.map(d => weekDays[d].code).join(', ');
        summary += ` on ${dayNames}`;
    }
    
    onSave(summary);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />

      <div className="relative w-full bg-[#000000] rounded-t-[40px] p-6 h-auto min-h-[50%] animate-slide-up shadow-[0_-10px_60px_rgba(0,183,255,0.15)] border-t border-white/20">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#E5E5E5]" style={{ fontFamily: 'Lexend' }}>Custom Recurrence</h2>
            <button onClick={onClose} className="p-2 bg-[#17171A] rounded-full text-white/70 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex flex-col gap-8 pb-12">
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="text-[#B0B0B0] text-sm font-medium ml-2 mb-1 block">Repeats every</label>
                    <input 
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="gradient-input w-full bg-[#17171A] text-[#E5E5E5] rounded-[20px] px-4 py-3 outline-none border border-white/10 transition-all font-light text-center text-xl"
                    />
                </div>
                <div className="flex-[2]">
                    <GradientSelect 
                        label="Unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        options={[
                            { value: 'day', label: parseInt(frequency) > 1 ? 'Days' : 'Day' },
                            { value: 'week', label: parseInt(frequency) > 1 ? 'Weeks' : 'Week' },
                            { value: 'month', label: parseInt(frequency) > 1 ? 'Months' : 'Month' },
                            { value: 'year', label: parseInt(frequency) > 1 ? 'Years' : 'Year' },
                        ]}
                    />
                </div>
            </div>

            {unit === 'week' && (
                <div className="animate-fade-in">
                    <label className="text-[#B0B0B0] text-sm font-medium ml-2 mb-3 block">Repeat on</label>
                    <div className="flex justify-between items-center bg-[#17171A] rounded-[24px] p-2 border border-white/10">
                        {weekDays.map((day) => {
                            const isSelected = selectedDays.includes(day.value);
                            return (
                                <button
                                    key={day.value}
                                    onClick={() => toggleDay(day.value)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                    style={{
                                        background: isSelected ? richGradientStr : 'transparent',
                                        color: isSelected ? '#FFFFFF' : '#B0B0B0',
                                        fontWeight: isSelected ? '700' : '400',
                                        boxShadow: isSelected ? '0px 4px 12px rgba(0, 183, 255, 0.3)' : 'none'
                                    }}
                                >
                                    <span style={{ fontFamily: 'Lexend' }}>{day.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="bg-[#17171A]/50 p-4 rounded-[20px] text-center border border-white/5">
                <p className="text-[#B0B0B0] text-sm">
                    Occurs every <span className="text-white font-bold">{frequency} {unit}{parseInt(frequency) > 1 ? 's' : ''}</span>
                    {unit === 'week' && selectedDays.length > 0 && (
                        <span> on <span className="text-[#00B7FF]">{selectedDays.map(d => weekDays[d].code).join(', ')}</span></span>
                    )}
                </p>
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-transform"
            style={{ background: richGradientStr }}
        >
            Done
        </button>

      </div>
      
      <style>{`
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .gradient-input:focus {
            border-color: transparent !important;
            background-image: linear-gradient(#17171A, #17171A), linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
        }
      `}</style>
    </div>
  );
};

// VITE ERROR FIX: Ensure this line is here!
export default CustomRepeatModal;