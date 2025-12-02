import React, { useState, useRef, useEffect } from 'react';
import { BsPlus } from "react-icons/bs";
import DateStrip from '../components/shared/DateStrip';
import TimeTimeline from '../components/shared/TimeTimeline';
import AddEventModal from '../components/shared/AddEventModal';
import QuickInputBar from '../components/shared/QuickInputBar';
import { parseNaturalLanguage } from '../utils/nlpHelper';

const EventsScreen = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent, itemToOpen, clearItemToOpen }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickInputOpen, setIsQuickInputOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Track event to edit

  // Long Press Logic Refs
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  // Filter events for the currently selected date
  const filteredEvents = events.filter(e => e.date === selectedDate);

  //  LISTEN FOR NAVIGATION FROM SEARCH 
  useEffect(() => {
    if (itemToOpen && itemToOpen.type === 'event') {
        setSelectedDate(itemToOpen.data.date); // Switch date strip to event date
        setEditingEvent(itemToOpen.data);      // Pre-fill modal
        setIsModalOpen(true);                  // Open modal
        clearItemToOpen();                     // Reset flag
    }
  }, [itemToOpen]);

  //  HANDLERS: INTERACTION 

  // 1. Long Press Detector (For FAB)
  const handlePointerDown = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        // Trigger Long Press -> Manual Modal
        handleAddNew(); 
    }, 800); 
  };

  // 2. Clear Timer
  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // 3. Click Handler (Short Press)
  const handleClick = () => {
    if (isLongPress.current) return; 
    // Trigger Short Press -> Smart Quick Input
    setIsQuickInputOpen(true);
  };

  //  HANDLERS: ACTIONS 

  const handleAddNew = () => {
    setEditingEvent(null); // Clear editing state (New Mode)
    setIsModalOpen(true);
    setIsQuickInputOpen(false);
  };

  // Open Modal for EXISTING Event (Edit Mode)
  const handleEventClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = (eventData) => {
    if (editingEvent) {
        onUpdateEvent(eventData);
    } else {
        onAddEvent(eventData);
    }
  };

  //  HANDLERS: NLP SUBMISSION 
  const handleQuickInputEnter = (text) => {
    // 1. Parse Text
    const result = parseNaturalLanguage(text, new Date());
    
    // 2. Create Event Object
    const newEvent = {
        id: Date.now().toString(),
        title: result.title,
        startTime: result.startTime,
        duration: result.duration,
        date: result.date,
        location: '',
        repeat: 'none',
        reminder: 'none',
        notes: 'Created via Quick Add'
    };

    // 3. Save
    onAddEvent(newEvent);
    setIsQuickInputOpen(false);
  };

  return (
    <div className="h-full w-full relative bg-black overflow-hidden">
      
      {/*  TIMELINE LAYER (Background)  */}
      {/* Stretches to fill screen, sits behind DateStrip */}
      <div className="absolute inset-0 z-0">
        <TimeTimeline 
            events={filteredEvents} 
            selectedDate={selectedDate} 
            onEventClick={handleEventClick} // Connects timeline cards to edit modal
        />
      </div>

      {/*  DATE HEADER LAYER (Foreground)  */}
      {/* mt-[26px] positions it below the status bar */}
      <div className="absolute top-0 left-0 w-full z-20 mt-[26px] pointer-events-none">
        <div className="pointer-events-auto">
            <DateStrip onDateSelected={(dateId) => setSelectedDate(dateId)} />
        </div>
      </div>

      {/*  QUICK INPUT BAR (Overlay)  */}
      {isQuickInputOpen && (
          <QuickInputBar 
            onEnter={handleQuickInputEnter} 
            onClose={() => setIsQuickInputOpen(false)}
          />
      )}

      {/*  FAB (Floating Action Button)  */}
      <div className="absolute bottom-[110px] right-[20px] z-[60]">
          <button 
            className="flex items-center justify-center active:scale-95 transition-transform select-none outline-none"
            style={{
                width: '100px',
                height: '100px',
                borderRadius: '100px',
                background: richGradientStr,
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitTapHighlightColor: 'transparent'
            }}
            // Attach Handlers
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={handleClick}
          >
              <BsPlus size={48} color="#FFFFFF" />
          </button>
      </div>

      {/*  FULL MODAL (Add/Edit)  */}
      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        onDelete={onDeleteEvent} // Pass delete handler
        selectedDate={selectedDate}
        eventToEdit={editingEvent} // Pass the event we are editing
      />

    </div>
  );
};

export default EventsScreen;