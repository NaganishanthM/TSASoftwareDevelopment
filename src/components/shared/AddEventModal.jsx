import React, { useState, useEffect } from 'react';
import { X, Trash2, Link as LinkIcon } from 'lucide-react'; 
import GradientSelect from '../ui/GradientSelect'; 
import GradientTimePicker from '../ui/GradientTimePicker'; 
import CustomRepeatModal from './CustomRepeatModal';

const AddEventModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, eventToEdit }) => {
  const defaultState = {
    title: '',
    startTime: '10:00',
    duration: '60',
    location: '',
    link: '', // Meeting Link
    repeat: 'none',
    reminder: 'none',
    notes: '',
    customDuration: '',
    customReminder: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [isCustomRepeatOpen, setIsCustomRepeatOpen] = useState(false);

  // Pre-fill logic: If eventToEdit exists, populate form. Else reset to default.
  useEffect(() => {
    if (isOpen) {
        if (eventToEdit) {
            setFormData(eventToEdit);
        } else {
            setFormData({
                ...defaultState,
                date: selectedDate || new Date().toISOString().split('T')[0]
            });
        }
    }
  }, [eventToEdit, isOpen, selectedDate]);

  if (!isOpen) return null;

  //  HANDLERS 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    // If "Custom..." is selected for repeat, open sub-modal
    if (name === 'repeat' && value === 'custom') {
        setIsCustomRepeatOpen(true);
        return;
    }
    handleChange(e);
  };

  const handleCustomRepeatSave = (val) => {
    setFormData(prev => ({ ...prev, repeat: val }));
  };

  const handleSubmit = () => {
    if (!formData.title) return; 
    
    onSave({
      ...formData,
      // Preserve ID if editing, create new if adding
      id: eventToEdit ? eventToEdit.id : Date.now().toString(),
      // Keep original date if editing, or use selected date if new
      date: eventToEdit ? eventToEdit.date : selectedDate
    });
    
    onClose();
  };

  const handleDelete = () => {
      if (eventToEdit && onDelete) {
          onDelete(eventToEdit.id);
          onClose();
      }
  };

  //  STYLES 
  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;
  // CSS class for inputs with gradient border on focus
  const inputStyle = "gradient-input w-full bg-[#17171A] text-[#E5E5E5] rounded-[20px] px-4 py-3 outline-none border border-white/10 transition-all font-light placeholder-white/20";
  const labelStyle = "text-[#B0B0B0] text-sm font-medium ml-2 mb-1 block";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full bg-[#000000] rounded-t-[40px] p-6 h-[85%] overflow-y-auto no-scrollbar animate-slide-up shadow-[0_-10px_40px_rgba(0,183,255,0.1)] border-t border-white/10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#E5E5E5]" style={{ fontFamily: 'Lexend' }}>
                {eventToEdit ? 'Event Details' : 'New Event'}
            </h2>
            
            <div className="flex gap-4">
                {/* Delete Button (Only if Editing) */}
                {eventToEdit && (
                    <button 
                        onClick={handleDelete}
                        className="p-2 bg-[#17171A] rounded-full text-red-500/80 hover:text-red-500 hover:bg-white/5 transition-colors"
                    >
                        <Trash2 size={24} />
                    </button>
                )}

                <button onClick={onClose} className="p-2 bg-[#17171A] rounded-full text-white/70 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-6 pb-32">
            
            {/* Title */}
            <div>
                <label className={labelStyle}>Event Name</label>
                <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="e.g. Physics Lecture" 
                    className={inputStyle}
                    autoFocus={!eventToEdit} 
                />
            </div>

            {/* Time Row */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <GradientTimePicker 
                        label="Start Time"
                        value={formData.startTime}
                        onChange={(e) => handleChange({ target: { name: 'startTime', value: e.target.value } })}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <GradientSelect 
                        label="Duration"
                        value={formData.duration}
                        onChange={handleSelectChange}
                        options={[
                            { value: '30', label: '30 min' },
                            { value: '45', label: '45 min' },
                            { value: '60', label: '1 Hour' },
                            { value: '90', label: '1.5 Hours' },
                            { value: '120', label: '2 Hours' },
                            { value: 'custom', label: 'Custom...' }
                        ]}
                    />
                    {/* Custom Duration Input */}
                    {formData.duration === 'custom' && (
                        <input 
                            name="customDuration"
                            type="number"
                            value={formData.customDuration}
                            onChange={handleChange}
                            placeholder="Minutes"
                            className={inputStyle + " animate-fade-in"}
                        />
                    )}
                </div>
            </div>

            {/* Location & Link */}
            <div className="flex flex-col gap-6">
                <div>
                    <label className={labelStyle}>Location</label>
                    <input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="e.g. Room 304" 
                        className={inputStyle} 
                    />
                </div>

                <div>
                    <label className={labelStyle}>Meeting/Resource Link</label>
                    <div className="relative">
                        <input 
                            name="link" 
                            value={formData.link || ''} 
                            onChange={handleChange} 
                            placeholder="https://zoom.us/..." 
                            className={inputStyle} 
                            style={{ paddingLeft: '44px' }}
                        />
                        <LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                    </div>
                </div>
            </div>

            {/* Options Row */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <GradientSelect 
                        label="Repeat"
                        value={formData.repeat}
                        onChange={handleSelectChange}
                        options={[
                            { value: 'none', label: 'Never' },
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'custom', label: 'Custom...' },
                            // If custom string exists, add it as option so it displays
                            ...(formData.repeat && formData.repeat.includes('Every') ? [{ value: formData.repeat, label: formData.repeat }] : [])
                        ]}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <GradientSelect 
                        label="Reminder"
                        value={formData.reminder}
                        onChange={handleSelectChange}
                        options={[
                            { value: 'none', label: 'None' },
                            { value: '5', label: '5 min before' },
                            { value: '15', label: '15 min before' },
                            { value: '60', label: '1 hour before' },
                            { value: 'custom', label: 'Custom...' }
                        ]}
                    />
                    {formData.reminder === 'custom' && (
                        <input 
                            name="customReminder"
                            type="number"
                            value={formData.customReminder}
                            onChange={handleChange}
                            placeholder="Minutes before"
                            className={inputStyle + " animate-fade-in"}
                        />
                    )}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className={labelStyle}>Notes</label>
                <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange}
                    placeholder="Add details..." 
                    className={`${inputStyle} h-32 resize-none`} 
                />
            </div>
        </div>

        {/* Save Button */}
        <div className="absolute bottom-8 left-6 right-6">
            <button 
                onClick={handleSubmit}
                className="w-full h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-transform"
                style={{ background: richGradientStr }}
            >
                {eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
        </div>
      </div>

      {/* Custom Repeat Sub-Modal */}
      <CustomRepeatModal 
        isOpen={isCustomRepeatOpen} 
        onClose={() => setIsCustomRepeatOpen(false)} 
        onSave={handleCustomRepeatSave}
      />
      
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        
        /* Gradient Focus Border */
        .gradient-input:focus {
            border-color: transparent !important;
            background-image: linear-gradient(#17171A, #17171A), 
                              linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
        }
      `}</style>
    </div>
  );
};

export default AddEventModal;