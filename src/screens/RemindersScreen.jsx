import React, { useState, useRef, useEffect } from 'react';
import { BsPlus } from "react-icons/bs";
import DateStrip from '../components/shared/DateStrip';
import FilterBar from '../components/shared/FilterBar';
import TaskCard from '../components/shared/TaskCard';
import AddTaskModal from '../components/shared/AddTaskModal';
import QuickInputBar from '../components/shared/QuickInputBar';
import { parseNaturalLanguage } from '../utils/nlpHelper';

const RemindersScreen = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleTask, itemToOpen, clearItemToOpen }) => {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('All Tasks');
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickInputOpen, setIsQuickInputOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Track task to edit

  // Long Press Logic Refs
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  // --- LISTEN FOR NAVIGATION FROM SEARCH ---
  useEffect(() => {
    if (itemToOpen && itemToOpen.type === 'task') {
        setEditingTask(itemToOpen.data);
        setIsModalOpen(true);
        
        // Optional: switch selectedDate to task date so user sees it in context
        if (itemToOpen.data.date) {
            setSelectedDate(itemToOpen.data.date);
        }
        
        clearItemToOpen();
    }
  }, [itemToOpen]);

  // --- FORMAT SUBTITLE HELPER ---
  const formatSubtitle = (dateStr, timeStr) => {
      if (!dateStr) return '';
      const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = date.getDate();
      
      const nth = (n) => {
          if (n > 3 && n < 21) return 'th';
          switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
      };

      const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return `Due ${dayName}, ${month} ${dayNum}${nth(dayNum)} at ${timePart}`;
  };

  // --- FILTERING & SORTING LOGIC ---
  const getProcessedTasks = () => {
      let filtered = tasks.filter(task => {
          // A. DATE RANGE CHECK (+/- 7 Days)
          const taskDate = new Date(task.date);
          const currentSelected = new Date(selectedDate);
          
          // Normalize to midnight to ignore time differences
          taskDate.setHours(0, 0, 0, 0);
          currentSelected.setHours(0, 0, 0, 0);

          // Calculate difference in days
          const diffTime = Math.abs(taskDate - currentSelected);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // If the task is more than 7 days away from selected date, hide it
          if (diffDays > 7) return false;

          // B. CATEGORY FILTER
          switch (filter) {
              case 'Important': return task.priority === 'high';
              case 'Low Priority': return task.priority === 'low';
              case 'Completed': return task.completed;
              case 'All Tasks': default: return true;
          }
      });

      // 2. SORT
      return filtered.sort((a, b) => {
          // Unchecked First
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          // Then by Date
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          // Then by Time
          return a.time.localeCompare(b.time);
      });
  };

  const displayTasks = getProcessedTasks();

  // --- HANDLERS: INTERACTION ---

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

  // --- HANDLERS: ACTIONS ---

  const handleAddNew = () => {
    setEditingTask(null); // Clear editing state (New Mode)
    setIsModalOpen(true);
    setIsQuickInputOpen(false);
  };

  const handleTaskClick = (task) => {
    setEditingTask(task); // Set task to edit (Edit Mode)
    setIsModalOpen(true);
  };

  const handleSave = (taskData) => {
    if (editingTask) {
        onUpdateTask(taskData);
    } else {
        onAddTask(taskData);
    }
  };

  // --- HANDLERS: NLP SUBMISSION ---
  const handleQuickInputEnter = (text) => {
    // 1. Parse Text
    const result = parseNaturalLanguage(text, new Date());
    
    // 2. Create Task Object
    const newTask = {
        id: Date.now().toString(),
        title: result.title,
        date: result.date,
        time: result.startTime,
        priority: result.priority || 'normal', 
        repeat: 'none',
        completed: false,
        notes: 'Created via Quick Add'
    };

    // 3. Save
    onAddTask(newTask);
    setIsQuickInputOpen(false);
  };

  return (
    <div className="h-full w-full relative bg-black overflow-hidden flex flex-col">
      
      {/* --- DATE HEADER --- */}
      <div className="w-full z-20 mt-[26px] shrink-0 relative">
         <DateStrip onDateSelected={(dateId) => setSelectedDate(dateId)} />
      </div>

      {/* --- FILTER BAR --- */}
      <div className="w-full z-20 shrink-0 -mt-2">
         <FilterBar selectedFilter={filter} onSelect={setFilter} />
      </div>

      {/* --- SCROLLABLE TASK LIST --- */}
      <div className="flex-1 w-full relative overflow-y-auto no-scrollbar px-6 pb-32 pt-4">
         
         {/* Top Fade */}
         <div 
            className="fixed left-0 w-full h-[32px] pointer-events-none z-50" 
            style={{ 
                top: '290px', 
                background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
                backdropFilter: 'blur(1px)' 
            }} 
          />

         <div className="flex flex-col gap-[19px]">
            {displayTasks.length > 0 ? (
                displayTasks.map(task => (
                    <TaskCard 
                        key={task.id}
                        // Pass properties
                        title={task.title}
                        subtitle={formatSubtitle(task.date, task.time)}
                        isCompleted={task.completed}
                        priority={task.priority}
                        // Handlers
                        onToggle={() => onToggleTask(task.id)}
                        onClick={() => handleTaskClick(task)} // Click to Edit
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center pt-10 opacity-50">
                    <p className="text-[#B0B0B0] font-light text-center">
                        No tasks found<br/>within 7 days
                    </p>
                </div>
            )}
            <div className="h-20"></div>
         </div>
      </div>

      {/* --- BOTTOM FADE --- */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-20"
        style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 3.65%, #000000 100%)',
            backdropFilter: 'blur(10px)'
        }}
      />

      {/* --- QUICK INPUT BAR (Overlay) --- */}
      {isQuickInputOpen && (
          <QuickInputBar 
            onEnter={handleQuickInputEnter} 
            onClose={() => setIsQuickInputOpen(false)}
          />
      )}

      {/* --- FAB (Floating Action Button) --- */}
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

      {/* --- ADD TASK MODAL --- */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        onDelete={onDeleteTask}
        selectedDate={selectedDate}
        taskToEdit={editingTask}
      />

    </div>
  );
};

export default RemindersScreen;