import React, { useState, useEffect } from 'react'; 
import { BsCalendarEvent, BsCheckCircle, BsPencilSquare, BsCalendarPlus, BsClock } from "react-icons/bs";
import QuickActionButton from '../components/ui/QuickActionButton';
import WidgetCard from '../components/ui/WidgetCard';
import { shouldShowEvent } from '../utils/recurrenceHelper'; 


import AddEventModal from '../components/shared/AddEventModal';
import AddTaskModal from '../components/shared/AddTaskModal';
import NoteEditor from '../components/shared/NoteEditor';

const formatTimeRange = (start, durationMins) => {
    const [h, m] = start.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(h, m);
    const endDate = new Date(startDate.getTime() + durationMins * 60000);
    const format = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${format(startDate)} - ${format(endDate)}`;
};

const DashboardScreen = ({ events = [], tasks = [], onAddEvent, onAddTask, onSaveNote }) => {
  
  // MODAL STATE 
  const [activeModal, setActiveModal] = useState(null); 
  // We need a local time state to trigger re-renders every minute so expired events disappear automatically
  const [now, setNow] = useState(new Date());

  // Update time every minute to ensure "Next Event" stays fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  //  STYLES 
  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;
  const faintGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.2) 0%, rgba(185, 7, 255, 0.2) 100%)`;
  const dimGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.3) 0%, rgba(185, 7, 255, 0.3) 100%)`;

  //  DATA LOGIC 
  const todayStr = new Date().toISOString().split('T')[0];
  
  // 1. Events Logic (SMART FILTER)
  const relevantEvents = events
    .filter(e => {
        // A. Must be scheduled for today
        if (!shouldShowEvent(e, todayStr)) return false;

        // B. Must NOT be finished yet
        const [h, m] = e.startTime.split(':').map(Number);
        const eventStart = new Date(); // Today
        eventStart.setHours(h, m, 0, 0);
        
        const duration = parseInt(e.duration) || 60;
        const eventEnd = new Date(eventStart.getTime() + duration * 60000);

        // Keep if the event ends in the future (or is happening now)
        return eventEnd > now; 
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const nextEvent = relevantEvents[0];
  const upcomingEvents = relevantEvents.slice(1); 

  // 2. Logic 
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const unfinishedTasksCount = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
  
  const isAllComplete = totalTasks > 0 && unfinishedTasksCount === 0;

  const closeModals = () => setActiveModal(null);

  const handleJoinClick = () => {
      if (nextEvent?.link) {
          window.open(nextEvent.link, '_blank');
      }
  };

  return (
    <div className="flex flex-col min-h-full w-full relative bg-black overflow-hidden">
      
        {/*  HEADER  */}
      <div className="px-[23px] pt-[68px] z-10 shrink-0">
        <h1 
          className="font-bold text-[#E5E5E5]"
          style={{ fontFamily: 'Lexend', fontSize: '48px', lineHeight: '60px' }}
        >
          Today
        </h1>
        <p 
          className="font-medium mt-2"
          style={{ fontFamily: 'Lexend', fontSize: '24px', lineHeight: '30px', color: 'rgba(176, 176, 176, 0.8)' }}
        >
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Widgets */}
      <div className="relative mt-[24px] w-full h-[250px] shrink-0">
        <div className="flex overflow-x-auto px-[23px] gap-4 h-full no-scrollbar snap-x items-center z-0">
            
            {/* CARD 1: UPCOMING EVENT */}
            <WidgetCard>
                <div className="h-full flex flex-col items-center relative">
                    <div className="mt-[2px] shrink-0 relative" style={{ width: '75px', height: '75px', borderRadius: '30px' }}>
                        <div className="flex items-center justify-center w-full h-full relative overflow-hidden" style={{ background: dimGradientStr, borderRadius: '30px', backdropFilter: 'blur(10px)', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }}>
                            <BsCalendarEvent size={32} color="#E5E5E5" />
                        </div>
                        <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    </div>
                    <div className="w-full mt-4 text-center px-2">
                        <h2 className="font-semibold text-[#E5E5E5] truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '24px', lineHeight: '30px' }}>
                            {nextEvent ? nextEvent.title : "No Upcoming Events"}
                        </h2>
                        <p className="font-normal mt-1 truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '16px', lineHeight: '20px', color: 'rgba(176, 176, 176, 0.8)' }}>
                            {nextEvent ? formatTimeRange(nextEvent.startTime, nextEvent.duration) : "Relax & Enjoy"}
                        </p>
                    </div>

                    {/* JOIN BUTTON */}
                    <div className="mt-auto w-full pb-1 relative flex justify-center">
                        <div 
                            className="absolute bottom-0 w-full transition-opacity duration-300"
                            style={{
                                height: '40px',
                                borderRadius: '53px',
                                background: richGradientStr,
                                opacity: nextEvent ? 0.7 : 0, 
                                filter: 'blur(12.5px)',
                                transform: 'translateY(5px)',
                                zIndex: 0
                            }}
                        />
                        <button 
                            disabled={!nextEvent}
                            onClick={handleJoinClick} 
                            className={`w-full flex items-center justify-center shrink-0 transition-all duration-300 relative z-10 ${nextEvent ? 'active:scale-95' : ''}`}
                            style={{
                                height: '40px',
                                borderRadius: '40px',
                                background: nextEvent ? richGradientStr : faintGradientStr, 
                                boxShadow: nextEvent ? '0px 6px 18.9px rgba(255, 255, 255, 0.1)' : 'none',
                                backdropFilter: 'blur(10px)',
                                cursor: nextEvent ? 'pointer' : 'default'
                            }}
                        >
                            <span className="font-semibold transition-colors duration-300" style={{ fontFamily: 'Lexend', fontSize: '20px', color: nextEvent ? '#E5E5E5' : 'rgba(229, 229, 229, 0.5)' }}>
                                {nextEvent ? "Join Now" : "No Events"}
                            </span>
                        </button>
                    </div>
                </div>
            </WidgetCard>

            {/* CARD 2: TASK COUNT */}
            <WidgetCard>
                <div className="h-full flex flex-col items-center">
                    <div className="mt-[2px] shrink-0 relative" style={{ width: '75px', height: '75px', borderRadius: '30px' }}>
                        <div className="flex items-center justify-center w-full h-full relative overflow-hidden" style={{ background: dimGradientStr, borderRadius: '30px', backdropFilter: 'blur(10px)', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }}>
                            <BsCheckCircle size={32} color="#E5E5E5" />
                        </div>
                        <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: richGradientStr, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    </div>
                    <div className="w-full mt-4 text-center px-2">
                        <h2 className="font-semibold text-[#E5E5E5] truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '24px', lineHeight: '30px' }}>
                            {completedTasksCount} Complete
                        </h2>
                        <p className="font-normal mt-1 truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '16px', lineHeight: '20px', color: 'rgba(176, 176, 176, 0.8)' }}>
                            {unfinishedTasksCount} Unfinished
                        </p>
                    </div>
                    
                    <div className="mt-auto w-full pb-1 relative">
                        <div 
                            className="absolute bottom-0 w-full transition-opacity duration-500"
                            style={{
                                height: '40px',
                                borderRadius: '40px',
                                background: richGradientStr,
                                opacity: isAllComplete ? 0.7 : 0,
                                filter: 'blur(12.5px)',
                                zIndex: 0
                            }}
                        />
                        <div className="relative w-full h-[40px] z-10">
                            <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: 'rgba(23, 23, 26, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '40px', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }} />
                            <div 
                                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out" 
                                style={{ 
                                    width: `${completionPercentage}%`, 
                                    background: isAllComplete ? richGradientStr : dimGradientStr, 
                                    borderRadius: '40px', 
                                    backdropFilter: 'blur(10px)' 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </WidgetCard>

            {/* CARD 3: UPCOMING EVENTS*/}
            <WidgetCard>
                 <div className="h-full flex flex-col items-center">
                    <div className="mt-[2px] shrink-0 relative" style={{ width: '75px', height: '75px', borderRadius: '30px' }}>
                        <div className="flex items-center justify-center w-full h-full relative overflow-hidden" style={{ background: dimGradientStr, borderRadius: '30px', backdropFilter: 'blur(10px)', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }}>
                            <BsClock size={32} color="#E5E5E5" />
                        </div>
                        <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: richGradientStr, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    </div>
                    <div className="w-full mt-4 flex flex-col gap-3 px-1">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.slice(0, 2).map((event) => (
                                <div key={event.id} className="text-center w-full">
                                    <h2 className="font-semibold text-[#E5E5E5] truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '18px', lineHeight: '22px' }}>
                                        {event.title}
                                    </h2>
                                    <p className="font-normal mt-1 truncate w-full block" style={{ fontFamily: 'Lexend', fontSize: '12px', lineHeight: '15px', color: 'rgba(176, 176, 176, 0.8)' }}>
                                        {formatTimeRange(event.startTime, event.duration)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-full pt-2">
                                <p className="text-[#B0B0B0] text-sm">No more events today</p>
                            </div>
                        )}
                    </div>
                </div>
            </WidgetCard>
            <div className="w-[10px] shrink-0"></div>
        </div>
        <div className="absolute left-0 top-0 pointer-events-none z-10" style={{ width: '30px', height: '100%', background: 'linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 100%)', backdropFilter: 'blur(0.5px)' }} />
        <div className="absolute right-0 top-0 pointer-events-none z-10" style={{ width: '82px', height: '100%', background: 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #000000 100%)', backdropFilter: 'blur(0.5px)' }} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-col items-center gap-[19px] mt-[19px] shrink-0 relative z-[60]">
        <QuickActionButton icon={BsPencilSquare} label="New Note" onClick={() => setActiveModal('note')} />
        <QuickActionButton icon={BsCheckCircle} label="New Task" onClick={() => setActiveModal('task')} />
        <QuickActionButton icon={BsCalendarPlus} label="New Event" onClick={() => setActiveModal('event')} />
      </div>

      {/* MODALS */}
      {activeModal === 'event' && <AddEventModal isOpen={true} onClose={closeModals} onSave={onAddEvent} selectedDate={todayStr} />}
      {activeModal === 'task' && <AddTaskModal isOpen={true} onClose={closeModals} onSave={onAddTask} selectedDate={todayStr} />}
      {activeModal === 'note' && <NoteEditor note={null} onClose={closeModals} onSave={onSaveNote} />}

    </div>
  );
};

export default DashboardScreen;