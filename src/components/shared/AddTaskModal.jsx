import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import GradientSelect from '../ui/GradientSelect';
import GradientTimePicker from '../ui/GradientTimePicker';
import CustomRepeatModal from './CustomRepeatModal';

const AddTaskModal = ({ isOpen, onClose, onSave, onDelete, taskToEdit, selectedDate }) => {
  const defaultState = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'normal',
    repeat: 'none',
    reminder: 'none',
    notes: '',
    customDuration: '',
    customReminder: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [isCustomRepeatOpen, setIsCustomRepeatOpen] = useState(false);

  // Pre-fill logic: If taskToEdit exists, populate form. Else reset.
  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setFormData(taskToEdit);
        } else {
            // If adding new, set date to whatever was selected on the DateStrip
            setFormData({
                ...defaultState,
                date: selectedDate || new Date().toISOString().split('T')[0]
            });
        }
    }
  }, [taskToEdit, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    // If user selects "Custom...", open the sub-modal instead of setting state immediately
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
      id: taskToEdit ? taskToEdit.id : Date.now().toString(),
      // Preserve completion status if editing, default false if new
      completed: taskToEdit ? taskToEdit.completed : false
    });
    
    onClose();
  };

  const handleDelete = () => {
      if (taskToEdit && onDelete) {
          onDelete(taskToEdit.id);
          onClose();
      }
  };

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;
  const inputStyle = "gradient-input w-full bg-[#17171A] text-[#E5E5E5] rounded-[20px] px-4 py-3 outline-none border border-white/10 transition-all font-light placeholder-white/20";
  const labelStyle = "text-[#B0B0B0] text-sm font-medium ml-2 mb-1 block";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Body */}
      <div className="relative w-full bg-[#000000] rounded-t-[40px] p-6 h-[85%] overflow-y-auto no-scrollbar animate-slide-up shadow-[0_-10px_40px_rgba(0,183,255,0.1)] border-t border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#E5E5E5]" style={{ fontFamily: 'Lexend' }}>
                {taskToEdit ? 'Task Details' : 'New Task'}
            </h2>
            <div className="flex gap-4">
                {/* DELETE BUTTON - Only shows if editing */}
                {taskToEdit && (
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

        <div className="flex flex-col gap-6 pb-32">
            {/* Title */}
            <div>
                <label className={labelStyle}>Task Name</label>
                <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="e.g. Buy Groceries" 
                    className={inputStyle}
                    autoFocus={!taskToEdit}
                />
            </div>

            {/* Date & Time */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className={labelStyle}>Due Date</label>
                    <input 
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={inputStyle}
                        style={{ colorScheme: 'dark' }} 
                    />
                </div>
                <div className="flex-1">
                    <GradientTimePicker 
                        label="Time"
                        value={formData.time}
                        onChange={(e) => handleChange({ target: { name: 'time', value: e.target.value } })}
                    />
                </div>
            </div>

            {/* Priority & Repeat */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <GradientSelect 
                        label="Priority"
                        value={formData.priority}
                        onChange={handleSelectChange}
                        options={[
                            { value: 'high', label: 'High' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'low', label: 'Low' }
                        ]}
                    />
                </div>
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
                            // If the current value is complex (from custom modal), add it as an option so it displays correctly
                            ...(formData.repeat && formData.repeat.includes('Every') ? [{ value: formData.repeat, label: formData.repeat }] : [])
                        ]}
                    />
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
            <button onClick={handleSubmit} className="w-full h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-transform" style={{ background: richGradientStr }}>
                {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
        </div>
      </div>

      {/* Custom Repeat Modal */}
      <CustomRepeatModal 
        isOpen={isCustomRepeatOpen} 
        onClose={() => setIsCustomRepeatOpen(false)} 
        onSave={handleCustomRepeatSave}
      />

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        
        /* Gradient Border on Focus Trick */
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

export default AddTaskModal;