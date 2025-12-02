import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';
import NavBar from './components/shared/NavBar';
import DashboardScreen from './screens/DashboardScreen';
import EventsScreen from './screens/EventsScreen';
import RemindersScreen from './screens/RemindersScreen';
import NotesScreen from './screens/NotesScreen';
import MenuScreen from './screens/MenuScreen';
import SearchScreen from './screens/SearchScreen';

const App = () => {
  //  NAVIGATION STATE 
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [itemToOpen, setItemToOpen] = useState(null); // For opening specific items from search

  //  STATUS BAR STATE 
  const [time, setTime] = useState(new Date());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(69);

  //  GLOBAL DATA: EVENTS (Calendar) 
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: 'Physics Lecture', 
      startTime: '10:00', 
      duration: '60', 
      location: 'Room 304', 
      link: 'https://zoom.us',
      date: new Date().toISOString().split('T')[0], // Today 
      repeat: 'weekly', 
      reminder: '15', 
      notes: 'Chapter 4 review.' 
    },
    { 
      id: '2', 
      title: 'Robotics Club', 
      startTime: '15:30', 
      duration: '90', 
      location: 'Lab 4',
      link: '',
      date: new Date().toISOString().split('T')[0], 
      repeat: 'weekly', 
      reminder: '30', 
      notes: 'Prep for competition.' 
    }
  ]);

  //  GLOBAL DATA: TASKS (Reminders) 
  const [tasks, setTasks] = useState([
    { 
      id: '1', 
      title: 'Submit TSA Project', 
      date: '2025-12-05', 
      time: '23:59', 
      completed: false, 
      priority: 'high', 
      repeat: 'none', 
      reminder: '60', 
      notes: 'Upload to portal before midnight.' 
    },
    { 
      id: '2', 
      title: 'Calculus Worksheet', 
      date: '2025-12-05', 
      time: '08:00', 
      completed: false, 
      priority: 'high', 
      repeat: 'none', 
      reminder: 'none', 
      notes: 'Derivatives section.' 
    },
    { 
      id: '3', 
      title: 'Email Counselor', 
      date: '2025-12-05', 
      time: '14:00', 
      completed: true, 
      priority: 'normal', 
      repeat: 'none', 
      reminder: 'none', 
      notes: 'Ask about transcript.' 
    },
    { 
      id: '4', 
      title: 'Buy Snacks', 
      date: '2025-12-05', 
      time: '17:30', 
      completed: true, 
      priority: 'low', 
      repeat: 'none', 
      reminder: 'none', 
      notes: '' 
    },
    { 
      id: '5', 
      title: 'Charge Laptop', 
      date: '2025-12-06', 
      time: '20:00', 
      completed: false, 
      priority: 'low', 
      repeat: 'daily', 
      reminder: 'none', 
      notes: '' 
    },
  ]);

  //  GLOBAL DATA: NOTES (Notebook) 
  const [notes, setNotes] = useState([
    { id: '1', title: 'Physics Formulas', subject: 'Science', content: 'F=ma, E=mc^2, p=mv...' },
    { id: '2', title: 'Project Ideas', subject: 'TSA', content: '1. Accessibility app\n2. Time management tool\n3. AI Tutor' },
    { id: '3', title: 'Grocery List', subject: 'Personal', content: 'Milk, Eggs, Bread, Butter, Coffee...' },
  ]);

  //  EFFECT: CLOCK & TIMER 
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setSessionSeconds(prev => prev + 1);
    }, 1000);

    // Battery API support
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', { 
    hour: 'numeric', minute: '2-digit', hour12: true 
  }).replace(/ AM| PM/, '');

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours === 0) return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //  HANDLERS: EVENTS 
  const handleSaveEvent = (newEvent) => setEvents([...events, newEvent]);
  
  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  //  HANDLERS: TASKS 
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(t => String(t.id) === String(updatedTask.id) ? updatedTask : t));
  };
  
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => String(t.id) !== String(taskId)));
  };
  
  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => String(t.id) === String(id) ? { ...t, completed: !t.completed } : t));
  };

  //  HANDLERS: NOTES 
  const handleSaveNote = (noteData) => {
    const existing = notes.find(n => n.id === noteData.id);
    if (existing) {
        setNotes(notes.map(n => n.id === noteData.id ? noteData : n));
    } else {
        setNotes([...notes, noteData]);
    }
  };

  const handleDeleteNote = (noteId) => {
      setNotes(notes.filter(n => n.id !== noteId));
  };

  //  NAVIGATION HANDLER 
  const handleSearchNavigation = (type, data) => {
      // 1. Close Search Overlay
      setIsSearchOpen(false);
      
      // 2. Set the item pending to open
      setItemToOpen({ type, data });

      // 3. Switch to the correct screen
      if (type === 'event') setCurrentScreen('events');
      else if (type === 'task') setCurrentScreen('reminders');
      else if (type === 'note') setCurrentScreen('notes');
  };

  const clearItemToOpen = () => setItemToOpen(null);

  //  ROUTING 
  const renderScreen = () => {
      switch(currentScreen) {
          case 'dashboard': 
            return <DashboardScreen 
                events={events} 
                tasks={tasks} 
                onAddEvent={handleSaveEvent} 
                onAddTask={handleAddTask} 
                onSaveNote={handleSaveNote}
            />;
          
          case 'events': 
            return <EventsScreen 
              events={events} 
              onAddEvent={handleSaveEvent} 
              onUpdateEvent={handleUpdateEvent} 
              onDeleteEvent={handleDeleteEvent}
              itemToOpen={itemToOpen} 
              clearItemToOpen={clearItemToOpen}
            />;
          
          case 'reminders': 
            return <RemindersScreen 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
                onToggleTask={handleToggleTask}
                itemToOpen={itemToOpen} 
                clearItemToOpen={clearItemToOpen}
            />;
          
          case 'notes': 
            return <NotesScreen 
                notes={notes}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
                onAddEvent={handleSaveEvent}
                itemToOpen={itemToOpen} 
                clearItemToOpen={clearItemToOpen}
            />;
            
          case 'menu': return <MenuScreen />;
          
          default: return <DashboardScreen events={events} />;
      }
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden relative font-sans bg-black">
      
      {/*  FUNCTIONAL STATUS BAR (Z-INDEX 300)  */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 text-white text-sm font-medium z-[300] absolute top-0 left-0 right-0 pointer-events-none">
        <div className="flex items-center gap-4">
            <span style={{ fontFamily: 'Lexend' }}>{formattedTime}</span>
            <div className="bg-[#1C1C1C] rounded-full px-3 py-1 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-500 font-mono">{formatDuration(sessionSeconds)}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <Signal size={16} />
          <Wifi size={16} />
          <div className="flex items-center gap-1">
            <span style={{ fontFamily: 'Lexend' }}>{batteryLevel}</span>
            <Battery size={18} />
          </div>
        </div>
      </div>

      {/*  MAIN CONTENT  */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
      </div>

      {/*  NAVIGATION  */}
      <NavBar 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen}
        onSearchClick={() => setIsSearchOpen(true)} 
      />

      {/*  GLOBAL SEARCH OVERLAY  */}
      {isSearchOpen && (
        <SearchScreen 
            events={events} 
            tasks={tasks} 
            notes={notes} 
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleSearchNavigation} 
        />
      )}
      
    </div>
  );
};

export default App;